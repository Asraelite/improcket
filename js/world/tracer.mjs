import Body from './body.mjs';
import {modules} from '../data.mjs';
import {playerShip} from './index.mjs';
import {images as assets} from '../assets.mjs';
import {celestials, particles, entities} from './index.mjs';
import * as particle from './particle.mjs';
import * as consts from '../consts.mjs';
import * as events from '../game/events.mjs';

export default class Tracer extends Body {
	constructor(ship) {
		super(...ship.pos, 0.1);

		this.ship = ship;
		this.path = [];
	}

	run(distance) {
		this.path = [];
		[this.x, this.y] = this.ship.com;
		[this.xvel, this.yvel] = [this.ship.xvel, this.ship.yvel];
		let dis = 0;
		let last = this.pos;
		let factor = 5;

		for (let i = 0; dis < distance; i++) {
			if (this.tickPath(factor)) break;
			this.path.push(this.pos);

			if (i % 10 === 0) {
				let [lx, ly] = last;
				dis += Math.sqrt((this.x - lx) ** 2 + (this.y - ly) ** 2);
				last = this.pos;
			}

			if (i > distance * 5) break;
		}

		[this.x, this.y] = this.ship.com;
	}

	tick() {
		this.run(this.ship.computation);
	}

	tickPath(speed) {
		this.tickMotion(speed);
		this.tickGravity(celestials, speed);
		return !!this.getCelestialCollision(celestials);
	}
}
