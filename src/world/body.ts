import {GRAVITATIONAL_CONSTANT as G, TAU} from '../consts';

export default class Body {
	x: number;
	y: number;
	r: number;
	xvel: number;
	yvel: number;
	rvel: number;
	rfriction: number;
	mass: number;
	
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

	getWorldPoint(lx, ly, test) {
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
		return [(x * Math.cos(-r) + y * Math.sin(-r)),
			-(-y * Math.cos(-r) + x * Math.sin(-r))];
	}

	// TODO: Remove and replace uses with `rotateVector`.
	relativeVector(x, y) {
		return this.rotateVector(x, y, this.r);
	}

	tickMotion(delta: number) {
		this.x += this.xvel * delta;
		this.y += this.yvel * delta;
		this.r += this.rvel * delta;
		this.rvel *= this.rfriction ** delta;
	}

	tickGravity(delta: number, bodies) {
		for (let body of bodies) {
			const distanceSquared = this.distanceToSquared(body);
			if (distanceSquared > (1000 ** 2)) continue;
			let force = body.mass / distanceSquared * G;
			let [[ax, ay], [bx, by]] = [this.com, body.com];
			let angle = Math.atan2(by - ay, bx - ax);
			this.xvel += Math.cos(angle) * force * delta;
			this.yvel += Math.sin(angle) * force * delta;
		}
	}

	distanceTo(body) {
		let [[ax, ay], [bx, by]] = [this.com, body.com];
		return Math.max(Math.sqrt(((bx - ax) ** 2) +
			((by - ay) ** 2)), 1);
	}

	distanceToSquared(body) {
		let [[ax, ay], [bx, by]] = [this.com, body.com];
		return Math.max(((bx - ax) ** 2) +
			((by - ay) ** 2), 1);
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

	applyDirectionalForce(x, y, rotation: number) {
		let [vx, vy] = this.rotateVector(x, y);
		this.xvel += vx / this.mass;
		this.yvel += vy / this.mass;
		this.rvel += rotation / this.mass;
	}

	orbit(cel, altitude, angle = 0) {
		this.gravity = true;
		let speed = Math.sqrt(G * cel.mass / (altitude + cel.radius));
		let [cx, cy] = cel.com;
		let [comX, comY] = this.localCom;
		let [dx, dy] = this.rotateVector(0, -(altitude + cel.radius), angle);
		[this.xvel, this.yvel] = this.rotateVector(speed, 0, angle);
		this.x = cx + dx - comX;
		this.y = cy + dy - comY;
	}
}
