import * as gui from './index.mjs';
import GuiElement from './element.mjs';

export default class GuiText extends GuiElement {
	constructor(text = '', x, y, w, h, {
		size = 10,
		align = 'left',
		valign = 'top',
		color = '#fff'
	} = {}) {
		w = w;
		h = h;
		super(x, y, w, h);
		this.type = 'text';
		this.color = color;
		this.text = text;
		this.font = size + 'pt Consolas';
		this.align = align;
		this.valign = valign;
	}
}
