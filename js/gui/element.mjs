const defaultOptions = {
	draw: true // Whether the element itself will be rendered.
}

export default class GuiElement {
	constructor(x, y, w, h, options) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.children = new Set();
		this.parent = null;

		this.options = Object.assign(options, defaultOptions);
	}

	append(element) {
		this.children.add(element);
		element.parent = this;
	}

	clear() {
		this.children.clear();
	}
}
