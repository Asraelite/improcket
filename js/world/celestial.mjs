import {images as assets} from '../assets.mjs';
import Body from './body.mjs';

export default class Celestial extends Body {
	constructor(x, y, radius, {
		density = 1,
		type = 'rock'
	}) {
		let mass = (radius ** 2) * density
		super(x, y, mass);
		this.radius = radius;

		this.type = type;
		let imageArr = Object.values(assets.celestials[this.type]);
		this.image = imageArr[Math.random() * imageArr.length | 0];
	}

	tick() {

	}

	get center() {
		return [this.x + this.radius / 2, this.y + this.radius / 2];
	}

	get diameter() {
		return this.radius * 2;
	}
}
