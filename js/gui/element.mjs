const defaultOptions = {
	draw: true // Whether the element itself will be rendered.
}

export default class GuiElement {
	constructor(x, y, w, h, options = {}) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.children = new Set();
		this.parent = null;

		this.type = 'element';

		this.options = Object.assign({}, defaultOptions, options);
	}

	append(element) {
		this.children.add(element);
		element.parent = this;
	}

	clear() {
		this.children.clear();
	}

	get shape() {
		return [this.x, this.y, this.w, this.h];
	}

	get center() {
		return [this.x + this.w / 2, this.y + this.h / 2];
	}

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
