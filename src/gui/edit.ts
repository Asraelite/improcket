import * as gui from './index';
import GuiElement from './element';
import GuiItemButton from './item';
import {state} from '../game/index';
import * as edit from '../game/edit';
import * as inventory from './inventory';

export default class GuiEdit extends GuiElement {
	constructor(x, y, w = 100, h = 30) {
		super(x, y, w, h);
		this.type = 'edit';
		this.tileWidth = 0;
		this.tileHeight = 0;
		this.active = false;
		this.guiInventory = null;
	}

	updateTiles() {
		this.children.clear();

		[this.tileWidth, this.tileHeight] = [edit.width, edit.height];

		let tileRatio = this.tileWidth / this.tileHeight;
		let rectRatio = this.w / this.h;
		let tileSize;
		let [ox, oy] = [0, 0];

		if (tileRatio < rectRatio) {
			tileSize = this.h / this.tileHeight;
			ox = (this.w - (tileSize * this.tileWidth)) / 2;
		} else {
			tileSize = this.w / this.tileWidth;
			oy = (this.h - (tileSize * this.tileHeight)) / 2;
		}

		let spacing = 0.1 * tileSize;

		for (let x = 0; x < this.tileWidth; x++)
		for (let y = 0; y < this.tileHeight; y++) {
			let tile = edit.getTile(x, y);
			let ex = x * tileSize + spacing / 2 + ox;
			let ey = y * tileSize + spacing / 2 + oy;
			let [ew, eh] = [tileSize - spacing, tileSize - spacing];

			let onclick = (button) => {
				this.tileClicked(x, y, button);
			};

			let el = new GuiItemButton(tile, onclick, ex, ey, ew, eh);
			this.append(el);
		}
	}

	tick() {
		if (state.editing && !this.active) this.updateTiles();
		this.active = state.editing;
		this.parent.options.drawChildren = this.active;
		if (!this.active) return;

		this.textElements.info.text = edit.info;

		[this.tileWidth, this.tileHeight] = [edit.width, edit.height];
	}

	getTile(x, y) {
		let [px, py] = edit.position;
		return edit.getTile(x + px, y + py);
	}

	tileClicked(x, y, button) {
		if (button == 'left') {
			edit.clickTile(x, y);
		} else if (button == 'right') {
			edit.rightClickTile(x, y);
		}

		this.updateTiles();
		this.guiInventory.updateTiles();
	}
}
