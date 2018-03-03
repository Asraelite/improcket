import {GRAVITATIONAL_CONSTANT as G} from '../consts.mjs';

export default class Body {
	constructor(x, y, mass) {
		this.x = x;
		this.y = y;
		this.r = 0;
		this.xvel = 0;
		this.yvel = 0;
		this.rvel = 0;
		this.mass = mass;
	}
	
	tickGravity(bodies) {
		bodies.forEach(b => {
			let force = b.mass / this.mass / (distanceTo(b) ** 2) * G;
			let angle = Math.atan2(b.y - this.y, b.x - this.x);
			this.xvel += Math.cos(angle) * force;
			this.yvel += Math.sin(angle) * force;
		});
	}

	distanceTo(body) {
		return Math.sqrt(((body.x - this.x) ** 2) + ((body.y - this.y) ** 2));
	}
}
