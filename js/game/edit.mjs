import * as game from './index.mjs';
import * as graphics from '../graphics/index.mjs';
import * as world from '../world/index.mjs';
import * as consts from '../consts.mjs';
import * as events from './events.mjs';
import * as inventory from './inventory.mjs';
import {modules} from '../data.mjs';
import {images as assets} from '../assets.mjs';

export let tiles = new Map();
export let width = 0;
export let height = 0;
export let position = [0, 0];
export let bounds = [0, 0, 0, 0];

export function init() {
	let ship = world.playerShip;
	let modules = ship.modules;
	let margin = consts.EDIT_MARGIN;

	modules.forEach(m => {
		let pos = [m.x, m.y];
		tiles.set(posId(...pos), new Tile(...pos, m));
	});

	let [sx, ex, sy, ey] = getBoundaries();
	[width, height] = [ex - sx + margin * 2 + 1, ey - sy + margin * 2 + 1];
	position = [sx - margin, sy - margin];
	let neededZoom = graphics.canvas.width / (Math.max(width, height) + 10);

	graphics.changePerspective('planet', 0, -5);
	graphics.setZoom(neededZoom);
}

export function end() {

}

function positionAdjust(x, y) {
	let [px, py] = position;
	return [x + px, y + py];
}

export function clickTile(x, y) {
	if (inventory.currentItem === null) return;
	let current = getTile(x, y).source;
	if (current.type !== null) {
		events.invalidTilePlacement();
		return;
	} else {
		events.tilePlacement();
	}

	let pos = positionAdjust(x, y);
	let id = posId(...pos);
	tiles.set(id, new Tile(...pos, inventory.currentItem));
	inventory.removeItem(...inventory.currentItem.ident);
}

export function rightClickTile(x, y) {
	let current = getTile(x, y).source;
	if (current.type === null) return;
	let { x: tx, y: ty } = current;
	let id = posId(tx, ty);
	tiles.set(id, new Tile(tx, ty, null));
	inventory.addItem(current.type, current.id);
}

export function getTile(x, y) {
	let [px, py] = position;
	let [tx, ty] = [px + x, py + y];
	let id = posId(tx, ty);
	if (!tiles.has(id))
		tiles.set(id, new Tile(tx, ty, null));
	return tiles.get(id);
	// TODO: Get linked tiles.
}

function posId(x, y) {
	return `${x}.${y}`;
}

function getBoundaries() {
	return [0, 0, 0, 2];
}

class Tile {
	constructor(x, y, module) {
		if (module === null) {
			this.module = null;
			this.image = null;
			this.type = null
			this.id = null;
		} else {
			({type: this.type, id: this.id} = module);
			this.module = modules[this.type][this.id];
			this.image = assets.modules[this.type][this.id];
			if (module.type === 'thruster') this.image = this.image.off;
		}
		this.x = x;
		this.y = y;
	}

	get valid() {
		return true;
	}

	get source() {
		return this;
	}

	get drawPos() {
		let [px, py] = pos;
		return [this.x + px, this.y + py];
	}
}
