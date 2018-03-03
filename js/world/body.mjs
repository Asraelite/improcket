import {GRAVITATIONAL_CONSTANT as G} from '../consts.mjs';

export default class Body {
	constructor(x, y, mass) {
		this.x = x;
		this.y = y;
		this.r = 0;
		this.xvel = 0;
		this.yvel = 0;
		this.rvel = 0;
		this.rfriction = 0.9;
		this.mass = mass;
	}

	tickMotion() {
		this.x += this.xvel;
		this.y += this.yvel;
		this.r += this.rvel;
		this.rvel *= this.rfriction;
	}

	tickGravity(bodies) {
		bodies.forEach(b => {
			let force = b.mass / this.mass / (this.distanceTo(b) ** 2) * G;
			let angle = Math.atan2(b.y - this.y, b.x - this.x);
			this.xvel += Math.cos(angle) * force;
			this.yvel += Math.sin(angle) * force;
		});
	}

	distanceTo(body) {
		return Math.max(Math.sqrt(((body.x - this.x) ** 2) +
			((body.y - this.y) ** 2)), 1);
	}

	approach(body, distance) {
		let angle = Math.atan2(body.y - this.y, body.x - this.x);
		this.x += Math.cos(angle) * distance;
		this.y += Math.sin(angle) * distance;
	}

	halt() {
		this.xvel = 0;
		this.yvel = 0;
	}

	applyDirectionalForce(x, y, r) {
		this.xvel += (x * Math.cos(this.r) - y * Math.sin(this.r)) / this.mass;
		this.yvel += (y * Math.cos(this.r) - x * Math.sin(this.r)) / this.mass;
		this.rvel += r / this.mass;
	}
}
