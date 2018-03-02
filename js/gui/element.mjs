import {Rect} from './misc.mjs';

const defaultOptions = {
	draw: true // Whether the element itself will be rendered.
}

export default class GuiElement extends Rect {
	constructor(x, y, w, h, options = {}) {
		super(x, y, w, h);
		this.children = new Set();
		this.parent = null;

		this.type = 'element';

		this.options = Object.assign({}, defaultOptions, options);
	}

	tick() {
		this.tickMouse();
		this.children.forEach(c => c.tick());
	}

	append(element) {
		this.children.add(element);
		element.parent = this;
	}

	clear() {
		this.children.clear();
	}
	// Code should be self-describing, comments are for fucking about.
	//   - Albert Einstein

	posRelative({x = null, xc = 0, y = null, yc = 0, w = null, h = null}) {
		if (x !== null) {
			this.x = (this.parent.w * x) - (this.w * xc);
		}
		if (y !== null)
			this.y = (this.parent.h * y) - (this.h * yc);
		if (w !== null)
			this.w = this.parent.w * w;
		if (h !== null)
			this.h = this.parent.h * h;
	}
}
