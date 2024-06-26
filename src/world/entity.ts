import Body from './body';
import {modules} from '../data';
import {playerShip} from './index';
import {images as assets} from '../assets';
import {celestials, particles, entities} from './index';
import * as particle from './particle';
import * as consts from '../consts';
import * as events from '../game/events';

export default class Entity extends Body {
	constructor(x, y, type = 'fuel', id = 'small', {
		xvel = 0,
		yvel = 0,
		gravity = false
	} = {}) {
		super(x, y, 0.1);
		this.xvel = xvel;
		this.yvel = yvel;
		this.width = 1;
		this.height = 1;
		this.radius = (this.width + this.height) / 2;
		this.type = type;
		this.id = id;
		if (this.type === 'fuelcan') {
			this.image = assets.modules.fuelcan;
			this.name = 'Fuel Can';
		} else {
			this.image = assets.modules[type][id];
			this.name = modules[type][id].name;
			if (this.type === 'thruster')
				this.image = this.image.off;
		}
		this.gravity = gravity;
		this.touched = false;
	}

	get com() {
		return [this.x + this.width / 2, this.y + this.height / 2];
	}

	get localCom() {
		return [this.width / 2, this.height / 2];
	}

	remove() {
		entities.delete(this);
	}

	tick(delta: number) {
		if (Math.abs(playerShip.x - this.x) > 500 ||
			Math.abs(playerShip.y - this.y) > 500) return;
		this.r += consts.ENTITY_ROTATION_RATE;
		this.tickMotion(delta);
		if (this.gravity) this.tickGravity(delta, celestials);
		let col = this.getCelestialCollision(celestials);

		if (col !== false) {
			this.remove();
		}

		if (playerShip.colliding(this.com, this.radius)) {
			if (this.touched) return;
			this.touched = true;
			let success = events.collectItem(this.type, this.id, this.name);
			if (!success) return;
			particle.createPickupBurst(playerShip, this.com);
			this.remove();
		} else {
			this.touched = false;
		}
	}
}
