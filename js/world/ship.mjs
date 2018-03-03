import Module from './module.mjs';
import Body from './body.mjs';
import * as world from './index.mjs';

export default class Ship extends Body {
	constructor(x, y) {
		super(x, y, 0);

		this.localCom = [0, 0];
		this.modules = new Set();
		this.maxRadius = 0;
	}

	get com() {
		let [lx, ly] = this.localCom;
		return [this.x + lx, this.y + ly];
	}

	tick() {
		this.tickMotion();
		this.tickGravity(world.celestials);
		this.resolveCollisions();
		this.modules.forEach(m => m.reset());
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

	resolveCollisions() {
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
		let p = this.getWorldPoint(...module.localCom)
		let dis = body.distanceTo({ com: p });
		if (dis < body.radius + 0.5) {
			this.approach(body, dis - (body.radius + 0.5));
			this.halt();
		}
	}

	applyThrust({ forward = 0, left = 0, right = 0, back = 0,
		turnLeft = 0, turnRight = 0}) {
		let turnForce = (turnRight - turnLeft) / 20;
		this.applyDirectionalForce(0, -forward / 30, turnForce);

		this.modules.forEach(m => {
			if (m.type !== 'thruster') return;
			m.power = forward;
		});

	}
}
