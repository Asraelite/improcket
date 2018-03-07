import Module from './module.mjs';
import Body from './body.mjs';
import * as world from './index.mjs';
import * as consts from '../consts.mjs';
import * as particle from './particle.mjs';
import * as events from '../game/events.mjs';
import Tracer from './tracer.mjs';
import {state} from '../game/index.mjs';

export default class Ship extends Body {
	constructor(x, y) {
		super(x, y, 0);

		this.localCom = [0, 0];
		this.modules = new Set();
		this.maxRadius = 0;
		this.landed = false;
		this.lastContactModule = null;
		this.poc = this.com;
		this.maxFuel = 0;
		this.fuel = 0;
		this.rotationPower = 0;
		this.cargoCapacity = 0;
		this.thrust = 0;
		this.crashed = false;
		this.timeWithoutFuel = 0;
	}

	get com() {
		let [lx, ly] = this.localCom;
		return [this.x + lx, this.y + ly];
	}

	get parentCelestial() {
		let closest = null;
		let closestDistance = 0;

		world.celestials.forEach(c => {
			let dis = this.distanceTo(c);
			if (closest === null || dis < closestDistance) {
				closest = c;
				closestDistance = dis;
			}
		});

		if (closestDistance > consts.MAX_PARENT_CELESTIAL_DISTANCE)
			return null;

		return closest;
	}

	tick() {
		if (this.crashed) return;
		if (!state.editing) this.tickMotion();
		if (!this.landed) this.tickGravity(world.celestials);
		if (!state.editing) this.resolveCollisions();

		this.modules.forEach(m => {
			if (m.type == 'thruster' && m.power !== 0) {
				for (let i = 0; i < 2; i++) particle.createThrustExhaust(m);
			}
		});

		this.modules.forEach(m => m.reset());

		if (events.shipLanded != this.landed) {
			if (this.landed) {
				events.landShip(this.parentCelestial)
			} else {
				events.launchShip()
			}
		}

		if (this.fuel === 0 && !state.gameOver) {
			if (this.timeWithoutFuel++ > 300)
				events.outOfFuel();
		} else {
			this.timeWithoutFuel = 0;
		}
	}

	clearModules() {
		this.modules.clear();
	}

	addFuel(amount) {
		this.fuel = Math.min(this.fuel + amount, this.maxFuel);
	}

	addModule(x, y, properties, options) {
		let module = new Module(x, y, this, {...properties, ...options});
		this.modules.add(module);
		this.refreshShape();
	}

	deleteModule(module) {
		this.modules.delete(module);
		this.refreshShape();
	}

	refreshShape() {
		let points = [];
		this.modules.forEach(m => points.push([...m.localCom, m.mass]));
		this.mass = points.reduce((a, [,,b]) => a + b, 0);
		this.localCom = points.reduce(([ax, ay], [bx, by, bm]) =>
			[ax + bx * bm, ay + by * bm], [0, 0])
			.map(x => x / this.mass);
		let [lx, ly] = this.localCom;
		this.maxRadius = points.reduce((a, [bx, by]) =>
			Math.max(Math.sqrt((bx - lx) ** 2 + (by - ly) ** 2), a), 0) + 1;

		this.maxFuel = 0;
		this.rotationPower = 0;
		this.cargoCapacity = 0;
		this.thrust = 0;

		this.modules.forEach(m => {
			if (m.type === 'fuel') {
				this.maxFuel += m.data.fuelCapacity;
			} else if (m.type === 'capsule') {
				this.rotationPower += m.data.rotation;
				this.cargoCapacity += m.data.capacity;
			} else if (m.type === 'thruster') {
				this.thrust += m.data.thrust;
			} else if (m.type === 'gyroscope') {
				this.rotationPower += m.data.rotation;
			} else if (m.type === 'cargo') {
				this.cargoCapacity += m.data.capacity;
			}
		});
	}

	colliding(point, radius) {
		let [px, py] = point;
		let result = false;

		this.modules.forEach(m => {
			let [mx, my] = this.getWorldPoint(...m.localCom);
			let dis = Math.sqrt((py - my) ** 2 + (px - mx) ** 2);
			if (dis < radius) result = true;
		});

		return result;
	}

	resolveCollisions() {
		this.landed = false;

		world.celestials.forEach(c => {
			let dis = this.distanceTo(c);

			if (dis < c.radius + this.maxRadius) {
				this.modules.forEach(m => {
					this.checkModuleCollision(m, c);
				});
			}
		})
	}

	checkModuleCollision(module, body) {
		let p = this.getWorldPoint(...module.localCom);
		let dis = body.distanceTo({ com: p });
		if (dis < body.radius + 0.5 + consts.EPSILON) {
			this.approach(body, dis - (body.radius + 0.5));
			this.moduleCollided(module);
			this.halt();
			this.resolveCelestialCollision(p, body, module);
			this.poc = p;
			this.lastContactModule = module;
		}
	}

	moduleCollided(module) {
		if (this.landed) return;
		let speed = Math.sqrt(this.xvel ** 2 + this.yvel ** 2);
		if (module.type !== 'thruster' || speed > consts.CRASH_SPEED) {
			events.crash();
			this.crashed = true;
		}
	}

	resolveCelestialCollision(pos, cel, module) {
		let celToCom = this.angleTo(...this.com, ...cel.com);
		let celToPoc = this.angleTo(...pos, ...cel.com);
		let pocToCom = this.angleTo(...this.com, ...pos);
		let shipAngle = this.normalizeAngle(this.r + Math.PI / 2);

		let turnAngle = this.angleDifference(celToPoc, pocToCom);
		let checkAngle = this.angleDifference(celToPoc, shipAngle);
		let correctionAngle = this.angleDifference(shipAngle, celToCom);

		let [force] = this.rotateVector(0, 1, turnAngle);

		if (Math.abs(checkAngle) < consts.TIP_ANGLE) {
			[force] = this.rotateVector(0, 1, correctionAngle);
			force *= 0.2;
		}

		let canLand = Math.abs(checkAngle) < 0.03
			&& Math.abs(this.rvel) < 0.001;

		if (canLand) {
			this.landed = true;
			this.rvel = 0;
			this.r = celToCom - Math.PI / 2;
		}

		this.rvel += force * consts.TIP_SPEED;
	}

	applyThrust({ forward = 0, left = 0, right = 0, back = 0,
		turnLeft = 0, turnRight = 0}) {

		let thrustForce = -forward * consts.THRUST_POWER * this.thrust;
		let turnForce = (turnRight - turnLeft) * consts.TURN_POWER;
		if (this.fuel <= 0) {
			this.fuel = 0;
			thrustForce = 0;
		} else {
			this.fuel -= Math.abs(thrustForce) * consts.FUEL_BURN_RATE;
		}
		turnForce *= this.rotationPower;

		this.applyDirectionalForce(0, thrustForce, turnForce);

		this.modules.forEach(m => {
			if (m.type !== 'thruster' || thrustForce == 0) return;
			m.power += forward;
		});

	}
}
