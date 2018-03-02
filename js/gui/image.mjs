import * as gui from './index.mjs';
import GuiElement from './element.mjs';

export default class GuiImage extends GuiElement {
	constructor(src, x, y, w, h) {
		w = w || src.width;
		h = h || src.height;
		super(x, y, w, h);
		this.type = 'image';
		this.image = src;
		this.imgRatio = src.width / src.height;
	}

	scaleImage({ w = null, h = null }) {
		if (w !== null && h === null) {
			this.w = w;
			this.h = w / this.imgRatio;
		} else if (h !== null && w === null) {
			this.h = h;
			this.w = h / this.imgRatio;
		} else if ( h !== null && w !== null) {
			this.w = w;
			this.h = h;
		}
	}
}
