import Module from './module.mjs';
import Body from './body.mjs';
import * as world from './index.mjs';

export default class Ship extends Body {
	constructor(x, y) {
		super(x, y, 0);

		this.com = [0, 0];
		this.modules = new Set();
	}

	tick() {
		this.tickMotion();
		this.tickGravity(world.celestials);
		this.resolveCollisions();
		this.modules.forEach(m => m.reset());
	}

	addModule(x, y, properties, options) {
		let module = new Module(x, y, {...properties, ...options});
		this.modules.add(module);
		this.refreshShape();
	}

	deleteModule(module) {
		this.modules.delete(module);
		this.refreshShape();
	}

	refreshShape() {
		let points = [];
		this.modules.forEach(m => points.push([...m.com, m.mass]));
		this.mass = points.reduce((a, [,,b]) => a + b, 0);
		this.com = points.reduce(([ax, ay], [bx, by, bm]) =>
			[ax + bx * bm, ay + by * bm], [0, 0])
			.map(x => x / this.mass);
		window.q = points;
	}

	resolveCollisions() {
		world.celestials.forEach(c => {
			let dis = this.distanceTo(c);
			if (dis < c.radius) {
				this.approach(c, dis - c.radius);
				this.halt();
			}
		})
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
