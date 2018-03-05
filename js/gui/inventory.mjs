import * as gui from './index.mjs';
import GuiElement from './element.mjs';
import GuiItemButton from './item.mjs';
import {state} from '../game/index.mjs';
import * as inventory from '../game/inventory.mjs';

export default class GuiInventory extends GuiElement {
	constructor(x, y, w = 100, h = 30) {
		super(x, y, w, h);
		this.type = 'inventory';
		this.tileWidth = 4;
		this.tileHeight = 5;
		this.currentPage = 0;
	}

	updateTiles() {
		this.children.clear();

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

		let spacing = 0.15 * tileSize;
		let pageSize = this.tileWidth * this.tileHeight;
		let offset = pageSize * this.currentPage;
		let tiles = inventory.getTiles().slice(offset);
		let tile;

		for (let y = 0; y < this.tileHeight; y++)
		for (let x = 0; x < this.tileWidth && tiles.length; x++) {
			let i = y * this.tileWidth + (x % this.tileWidth) + offset;
			tile = tiles.shift();

			let ex = x * tileSize + spacing / 2 + ox + this.x;
			let ey = y * tileSize + spacing / 2 + oy + this.y;
			let [ew, eh] = [tileSize - spacing, tileSize - spacing];

			let ident = tile.ident;

			let onclick = (button) => {
				this.tileClicked(...ident, button);
			};

			let cur = inventory.currentItem;
			let selected = cur !== null && tile.type === cur.type
				&& tile.id === cur.id;

			let el = new GuiItemButton(tile, onclick, ex, ey, ew, eh, {
				padding: 0.1,
				selected: selected,
				quantity: tile.quantity
			});

			this.append(el);
		}
	}

	tick() {
		if (state.inventory && !this.active) this.updateTiles();
		this.active = state.inventory;
		this.options.draw = this.options.drawChildren = this.active;
		if (!this.active) return;
	}

	getTile(x, y) {
		return this.getTile(x + px, y + py);
	}

	tileClicked(type, id, button) {
		if (button == 'left') inventory.selectItem(type, id);

		if (!state.editing) {
			if (button == 'left') {
				inventory.addItem(type, id);
			} else if (button == 'right') {
				inventory.removeitem(type, id);
			}
		}

		this.updateTiles();
	}
}
