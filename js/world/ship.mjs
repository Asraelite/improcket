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
		if (!state.editing) this.tickMotion();
		if (!this.landed) this.tickGravity(world.celestials);
		if (!state.editing) this.resolveCollisions();

		this.modules.forEach(m => {
			if (m.type == 'thruster' && m.power !== 0) {
				for (let i = 0; i < 2; i++) particle.createThrustExhaust(m);
			}
		});

		this.modules.forEach(m => m.reset());

		if (events.shipLanded != this.landed)
			this.landed ? events.landShip() : events.launchShip();
	}

	clearModules() {
		this.modules.clear();
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

	resolveCelestialCollision(pos, cel) {
		// I don't even know why this works, don't touch it.
		let theta = this.angleTo(...this.com, ...cel.com);
		let angleToCom = this.angleTo(...this.com, ...pos);
		let turnAngle = angleToCom - theta;
		let checkAngle = theta - this.r - Math.PI / 2;
		let [force] = this.rotateVector(0, 1, turnAngle);
		if (Math.abs(checkAngle) < consts.TIP_ANGLE) {
			force *= -1;
		}
		let canLand = Math.abs(checkAngle) < 0.03
			&& Math.abs(this.rvel) < 0.001;

		if (canLand) {
			this.landed = true;
			this.rvel = 0;
			this.r = theta - Math.PI / 2;
		}
		this.rvel -= force * consts.TIP_SPEED;
	}

	checkModuleCollision(module, body) {
		let p = this.getWorldPoint(...module.localCom);
		let dis = body.distanceTo({ com: p });
		if (dis < body.radius + 0.5 + consts.EPSILON) {
			this.approach(body, dis - (body.radius + 0.5));
			this.halt();
			this.resolveCelestialCollision(p, body);
		}
	}

	applyThrust({ forward = 0, left = 0, right = 0, back = 0,
		turnLeft = 0, turnRight = 0}) {

		let thrustForce = -forward * consts.THRUST_POWER;
		let turnForce = (turnRight - turnLeft) * consts.TURN_POWER;

		this.applyDirectionalForce(0, thrustForce, turnForce);

		this.modules.forEach(m => {
			if (m.type !== 'thruster') return;
			m.power += forward;
		});

	}
}
