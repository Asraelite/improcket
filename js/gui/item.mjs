import * as gui from './index.mjs';
import GuiButton from './button.mjs';

export default class GuiItemButton extends GuiButton {
	constructor(tile, onclick, x, y, w = 50, h = 50, {
		padding = 0,
		selected = false,
		quantity = 1,
	} = {}) {
		super(null, onclick, x, y, w, h);
		this.module = tile.module;
		this.image = tile.image;
		this.type = 'itemButton';
		this.padding = padding;
		this.selected = selected;
		this.quantity = quantity
	}

	click() {
		if (this.drawn)
			this.onclick('left');
	}

	rightClick() {
		if (this.drawn)
			this.onclick('right');
	}
}
