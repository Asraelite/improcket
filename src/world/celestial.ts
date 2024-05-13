import { tempCanvas, tempContext } from '../graphics/index';
import { images as assets } from '../assets';
import Body from './body';
import { PLANET_IMAGE_SIZE_SMALL, PLANET_IMAGE_SIZE_LARGE } from '../consts';

export default class Celestial extends Body {
	radius: number;
	imageSmall: CanvasImageSource;
	imageLarge: CanvasImageSource;
	type: string;

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

		tempCanvas.width = PLANET_IMAGE_SIZE_SMALL;
		tempCanvas.height = PLANET_IMAGE_SIZE_SMALL;
		tempContext.clearRect(0, 0, PLANET_IMAGE_SIZE_SMALL, PLANET_IMAGE_SIZE_SMALL);
		tempContext.drawImage(svgImage, 0, 0, PLANET_IMAGE_SIZE_SMALL, PLANET_IMAGE_SIZE_SMALL);
		this.imageSmall = new Image();
		this.imageSmall.src = tempCanvas.toDataURL();

		tempCanvas.width = PLANET_IMAGE_SIZE_LARGE;
		tempCanvas.height = PLANET_IMAGE_SIZE_LARGE;
		tempContext.clearRect(0, 0, PLANET_IMAGE_SIZE_LARGE, PLANET_IMAGE_SIZE_LARGE);
		tempContext.drawImage(svgImage, 0, 0, PLANET_IMAGE_SIZE_LARGE, PLANET_IMAGE_SIZE_LARGE);
		this.imageLarge = new Image();
		this.imageLarge.src = tempCanvas.toDataURL();

		// this.image = tempContext.getImageData(0, 0, PLANET_IMAGE_SIZE, PLANET_IMAGE_SIZE);
	}

	get com() {
		return [this.x + this.radius, this.y + this.radius];
	}

	tick(delta: number) {

	}

	get diameter() {
		return this.radius * 2;
	}
}
