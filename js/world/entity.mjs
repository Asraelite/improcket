import Body from './body.mjs';
import {modules} from '../data.mjs';
import {playerShip} from './index.mjs';
import {images as assets} from '../assets.mjs';
import {celestials, particles, entities} from './index.mjs';
import * as particle from './particle.mjs';
import * as consts from '../consts.mjs';
import * as events from '../game/events.mjs';

export default class Entity extends Body {
	constructor(x, y, type = 'fuel', id = 'small', {
		xvel = 0,
		yvel = 0,
		gravity = false
	} = {}) {
		super(x, y, 100);

		this.xvel = xvel;
		this.yvel = yvel;
		this.width = 1;
		this.height = 1;
		this.radius = (this.width + this.height) / 2;
		this.type = type;
		this.id = id;
		this.image = assets.modules[type][id];
		this.gravity = gravity;
		this.touched = false;
	}

	get com() {
		return [this.x + this.width / 2, this.y + this.height / 2];
	}

	orbit(celestial, radius) {
		this.gravity = true;
	}

	remove() {
		entities.delete(this);
	}

	tick() {
		this.r += consts.ENTITY_ROTATION_RATE;
		this.tickMotion();
		if (this.gravity) this.tickGravity(celestials);
		let col = this.getCelestialCollision(celestials);

		if (col !== false) {
			this.remove();
		}

		if (playerShip.colliding(this.com, this.radius)) {
			let success = events.collectItem(this.type, this.id);
			if (!success) return;
			particle.createPickupBurst(playerShip, this.com);
			this.remove();
		}
	}
}
