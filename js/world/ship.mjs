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
		this.modules.forEach(m => points.push([m.x, m.y, m.mass]));
		this.mass = points.reduce((a, [,,b]) => a + b, 0);
		this.com = points.reduce(([ax, ay], b) =>
			[ax + b.x * b.mass, ay + b.y * b.mass], [0, 0])
			.map(x => x / this.mass);
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
}
