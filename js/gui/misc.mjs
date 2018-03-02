import * as gui from './index.mjs';
import GuiElement from './element.mjs';

export class GuiImage extends gui.GuiElement {
	constructor(src, x, y, w, h) {
		w = w || src.width;
		h = h || src.height;
		super(x, y, w, h);
		this.image = src;
	}
}
