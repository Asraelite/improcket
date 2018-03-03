import {images as assets} from '../assets.mjs';

export default class Module {
	constructor(x, y, ship, {
		name = 'Unnamed Module',
		type = 'block',
		id = 'unknown',
		mass = 1,
		// Fuel
		filled = false,
		fuelCapacity = 0,
		...properties
	}) {
		this.x = x;
		this.y = y;
		this.name = name;
		this.type = type;
		this.mass = mass;
		this.ship = ship;
		this.id = id;
		this.images = assets.modules[this.type][this.id];
		// Fuel
		if (this.type == 'fuel') {
			this.fuel = filled ? fuelCapacity : 0;
		} else if (this.type == 'thruster') {
			this.power = 0;
		}
	}

	reset() {
		if (this.type == 'thruster') {
			this.power = 0;
		}
	}

	get com() {
		return this.ship.getWorldPoint(...this.localCom);
	}

	get currentImage() {
		if (this.type == 'thruster') {
			return this.power > 0 ? this.images.on : this.images.off;
		} else {
			return this.images;
		}
	}

	get localCom() {
		return [this.x + 0.5, this.y + 0.5];
	}
}
