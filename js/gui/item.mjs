import * as gui from './index.mjs';
import GuiButton from './button.mjs';

export default class GuiItemButton extends GuiButton {
	constructor(module, onclick, x, y, w = 50, h = 50) {
		super(null, onclick, x, y, w, h);
		this.image = module === null ? null : module.currentImage;
		this.type = 'itemButton';
	}

	click() {
		this.onclick('left');
	}

	rightClick() {
		this.onclick('right');
	}
}
