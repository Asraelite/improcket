import * as gui from './index.mjs';
import GuiElement from './element.mjs';
import GuiItemButton from './item.mjs';
import {state} from '../game/index.mjs';
import * as edit from '../game/edit.mjs';
import * as inventory from './inventory.mjs';

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
			let ex = x * tileSize + spacing / 2 + ox + this.x;
			let ey = y * tileSize + spacing / 2 + oy + this.y;
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
		this.options.draw = this.options.drawChildren = this.active;
		if (!this.active) return;

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
