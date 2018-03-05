import * as gui from './index.mjs';
import GuiButton from './button.mjs';

export default class GuiItemButton extends GuiButton {
	constructor(tile, onclick, x, y, w = 50, h = 50) {
		super(null, onclick, x, y, w, h);
		this.module = tile.module;
		this.image = tile.image;
		this.type = 'itemButton';
	}

	click() {
		this.onclick('left');
	}

	rightClick() {
		this.onclick('right');
	}
}
