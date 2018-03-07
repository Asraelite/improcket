import Body from './body.mjs';
import {celestials, particles} from './index.mjs';

export function createThrustExhaust(thruster) {
	let ship = thruster.ship;
	let [fx, fy] = ship.relativeVector(0, 0.2);
	let [dx, dy] = ship.relativeVector((Math.random() - 0.5) * 0.5, 0.5);
	let [cx, cy] = thruster.com;
	particles.add(new Particle(cx + dx, cy + dy, {
		xvel: ship.xvel + fx,
		yvel: ship.yvel + fy,
		color: '#f4c542',
		lifetime: 5,
		size: 0.07
	}));
}

export function createEndEditBurst(ship) {
	for (let i = 0; i < 20; i++) {
		particles.add(new Particle(...ship.poc, {
			color: '#ccc',
			lifetime: Math.random() * 30 + 25,
			size: Math.random() * 0.3 + 0.05,
			spray: 0.3,
			gravity: true
		}));
	}
}

export function createPickupBurst(ship, point) {
	for (let i = 0; i < 20; i++) {
		particles.add(new Particle(...point, {
			xvel: ship.xvel,
			yvel: ship.yvel,
			color: '#eae55d',
			lifetime: Math.random() * 20 + 15,
			friction: 0.95,
			size: Math.random() * 0.2 + 0.05,
			spray: 0.3
		}));
	}
}

export function createItemToss(ship) {
	particles.add(new Particle(...ship.com, {
		xvel: ship.xvel,
		yvel: ship.yvel,
		color: '#a87234',
		lifetime: 50,
		size: 0.6,
		spray: 0.4
	}));
}

class Particle extends Body {
	constructor(x, y, {
		xvel = 0,
		yvel = 0,
		spray = 0.1,
		fizzle = 0,
		maxFizzle = fizzle * 2,
		color = '#fff',
		gravity = false,
		lifetime = 50,
		size = 0.1,
		friction = 0.99
	}) {
		super(x, y, 0.1);

		this.size = size;
		this.xvel = xvel + (Math.random() - 0.5) * spray;
		this.yvel = yvel + (Math.random() - 0.5) * spray;
		this.friction = friction;
		this.fizzle = fizzle;
		this.maxFizzle = maxFizzle;
		this.color = color;
		this.gravity = gravity;
		this.life = lifetime;
	}

	get com() {
		return [this.x - this.size / 2, this.y - this.size / 2];
	}

	tick() {
		if (this.life-- <= 0) {
			particles.delete(this);
			return;
		}

		this.tickMotion();
		if (this.gravity) this.tickGravity(celestials);

		this.xvel *= this.friction;
		this.yvel *= this.friction;
		this.x += (Math.random() - 0.5) * this.fizzle;
		this.y += (Math.random() - 0.5) * this.fizzle;
		if (this.fizzle < this.mazFizzle) this.fizzle *= 1.05;
	}
}
