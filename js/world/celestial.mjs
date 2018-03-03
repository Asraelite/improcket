import Body from './body.mjs';

export default class Celestial extends Body {
	constructor(x, y, radius, {
		density = 1,
		mass = (radius ** 2) * density
	}) {
		super(x, y, mass);
	}
}
