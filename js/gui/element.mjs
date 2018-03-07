import {Rect} from './misc.mjs';

const defaultOptions = {
	draw: true, // Whether the element itself will be rendered.
	drawChildren: true // Whether children will be rendered.
}

export default class GuiElement extends Rect {
	constructor(x, y, w, h, options = {}) {
		super(x, y, w, h);
		this.children = new Set();
		this.parent = null;

		this.type = 'element';

		this.options = Object.assign({}, defaultOptions, options);
	}

	tickElement() {
		this.tickMouse();
		this.tick();
		this.children.forEach(c => c.tickElement());
	}

	tick() {

	}

	get drawn() {
		if (!this.options.drawChildren) return false;
		if (!this.parent) return true;
		return this.parent.drawn;
	}

	append(element) {
		this.children.add(element);
		element.parent = this;
		element.x += this.x;
		element.y += this.y;
	}

	clear() {
		this.children.clear();
	}
	// Code should be self-describing, comments are for fucking about.
	//   - Albert Einstein

	posRelative({x = null, xc = 0, y = null, yc = 0, w = null, h = null}) {
		if (x !== null)
			this.x = (this.parent.w * x) - (this.w * xc) + this.parent.x;
		if (y !== null)
			this.y = (this.parent.h * y) - (this.h * yc) + this.parent.y;
		if (w !== null)
			this.w = this.parent.w * w;
		if (h !== null)
			this.h = this.parent.h * h;
	}
}
