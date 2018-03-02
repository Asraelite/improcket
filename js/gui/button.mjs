import * as gui from './index.mjs';
import GuiElement from './element.mjs';

export default class GuiButton extends GuiElement {
	constructor(text, onclick, x, y, w = 100, h = 30) {
		super(x, y, w, h);
		this.type = 'button';
		this.text = text;
		this.onclick = onclick;
	}
}
