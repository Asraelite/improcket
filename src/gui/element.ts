import { Rect } from './misc';

const defaultOptions = {
	draw: true, // Whether the element itself will be rendered.
	drawChildren: true // Whether children will be rendered.
}

export default class GuiElement extends Rect {
	children: Set<GuiElement>;
	parent: GuiElement;

	constructor(x, y, width, height, options = {}) {
		super(x, y, width, height);
		this.children = new Set();
		this.parent = null;

		this.type = 'element';

		this.options = { ...defaultOptions, ...options };
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

	posRelative({ x = null, xc = 0, y = null, yc = 0, w = null, h = null }) {
		if (x !== null)
			this.sourceX = () => (this.parent.w * x) - (this.w * xc) + this.parent.x;
		if (y !== null)
			this.sourceY = () => (this.parent.h * y) - (this.h * yc) + this.parent.y;
		if (w !== null)
			this.sourceWidth = () => this.parent.w * w;
		if (h !== null)
			this.sourceHeight = () => this.parent.h * h;
	}
}
