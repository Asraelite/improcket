export default class Module {
	constructor(x, y, {
		name = 'Unnamed Module',
		type = 'block',
		mass = 1,
		...properties
	}) {
		this.x = x;
		this.y = y;
		this.name = name;
		this.type = type;
		this.mass = mass;

	}
}
