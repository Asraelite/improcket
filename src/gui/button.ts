import * as gui from './index';
import GuiElement from './element';

export default class GuiButton extends GuiElement {
	constructor(text, onclick, x, y, w = 100, h = 30) {
		super(x, y, w, h);
		this.type = 'button';
		this.text = text;
		this.onclick = onclick;
	}

	click() {
		if (this.drawn && !this.options.disabled)
			this.onclick();
	}
}
