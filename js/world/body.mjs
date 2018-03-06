import {GRAVITATIONAL_CONSTANT as G, TAU} from '../consts.mjs';

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

	get com() {
		return [this.x, this.y];
	}

	get pos() {
		return [this.x, this.y];
	}

	get speed() {
		return Math.sqrt(this.xvel ** 2 + this.yvel ** 2);
	}

	angleDifference(a, b) {
		return Math.atan2(Math.sin(a - b), Math.cos(a - b));
	}

	normalizeAngle(a = this.r) {
		return ((a % TAU) + TAU) % TAU;
	}

	getCelestialCollision(celestials) {
		let result = false;
		celestials.forEach(c => {
			let dis = this.distanceTo(c);
			if (dis < c.radius) result = c;
		});
		return result;
	}

	getWorldPoint(lx, ly) {
		let [cx, cy] = this.localCom;
		let [nx, ny] = this.rotateVector(lx - cx, ly - cy, this.r);
		return [nx + this.x + cx, ny + this.y + cy];
	}

	getLocalPoint(wx, wy) {
		let [lx, ly] = [wx - this.x, wy - this.y];
		let [cx, cy] = this.localCom;
		let [nx, ny] = this.rotateVector(lx, ly, -this.r);
		return [nx - cx, ny - cy];
	}

	rotateVector(x, y, r = this.r) {
		return [(x * Math.cos(r) - y * Math.sin(r)),
			(y * Math.cos(r) - x * Math.sin(r))];
	}

	// TODO: Remove and replace uses with `rotateVector`.
	relativeVector(x, y) {
		return this.rotateVector(x, y, this.r);
	}

	tickMotion(speed = 1) {
		this.x += this.xvel * speed;
		this.y += this.yvel * speed;
		this.r += this.rvel * speed;
		this.rvel *= this.rfriction * speed;
	}

	tickGravity(bodies, speed = 1) {
		bodies.forEach(b => {
			let force = b.mass / (this.distanceTo(b) ** 2) * G;
			let [[ax, ay], [bx, by]] = [this.com, b.com];
			let angle = Math.atan2(by - ay, bx - ax);
			this.xvel += Math.cos(angle) * force * speed;
			this.yvel += Math.sin(angle) * force * speed;
		});
	}

	distanceTo(body) {
		let [[ax, ay], [bx, by]] = [this.com, body.com];
		return Math.max(Math.sqrt(((bx - ax) ** 2) +
			((by - ay) ** 2)), 1);
	}

	angleTo(ax, ay, bx, by) {
		return Math.atan2(by - ay, bx - ax);
	}

	approach(body, distance) {
		let [[ax, ay], [bx, by]] = [this.com, body.com];
		let angle = Math.atan2(by - ay, bx - ax);
		this.x += Math.cos(angle) * distance;
		this.y += Math.sin(angle) * distance;
	}

	halt() {
		this.xvel = 0;
		this.yvel = 0;
	}

	applyDirectionalForce(x, y, r) {
		let [vx, vy] = this.rotateVector(x, y);
		this.xvel += vx;
		this.yvel += vy;
		this.rvel += r / this.mass;
	}

	orbit(cel, altitude) {
		this.gravity = true;
		let speed = Math.sqrt(G * cel.mass / (altitude + cel.radius));
		let [cx, cy] = cel.com;
		this.x = cx;
		this.y = cy - (altitude + cel.radius);
		this.yvel = 0;
		this.xvel = speed;
	}
}
