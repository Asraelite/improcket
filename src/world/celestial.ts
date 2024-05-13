import {tempCanvas, tempContext} from '../graphics/index';
import {images as assets} from '../assets';
import Body from './body';
import { PLANET_IMAGE_SIZE } from '../consts';

export default class Celestial extends Body {
	constructor(x, y, radius, {
		density = 1,
		type = 'rock'
	}) {
		let mass = (radius ** 2) * density
		super(x, y, mass);
		this.radius = radius;

		this.type = type;
		const imageArr = Object.values(assets.celestials[this.type]);
		const svgImage = imageArr[Math.random() * imageArr.length | 0];
		tempCanvas.width = PLANET_IMAGE_SIZE;
		tempCanvas.height = PLANET_IMAGE_SIZE;
		tempContext.clearRect(0, 0, PLANET_IMAGE_SIZE, PLANET_IMAGE_SIZE);
		tempContext.drawImage(svgImage, 0, 0, PLANET_IMAGE_SIZE, PLANET_IMAGE_SIZE);
		this.image = new Image();
    	this.image.src = tempCanvas.toDataURL();
		// this.image = tempContext.getImageData(0, 0, PLANET_IMAGE_SIZE, PLANET_IMAGE_SIZE);
	}

	get com() {
		return [this.x + this.radius, this.y + this.radius];
	}

	get escapeVelocity() {
		
	}

	tick() {

	}

	get diameter() {
		return this.radius * 2;
	}
}
