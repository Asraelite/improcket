import * as game from './index.mjs';
import * as graphics from '../graphics/index.mjs';
import * as world from '../world/index.mjs';
import * as consts from '../consts.mjs';
import * as events from './events.mjs';
import {modules} from '../data.mjs';
import {images as assets} from '../assets.mjs';

export let tiles = new Map();
export let width = 0;
export let height = 0;
export let position = [0, 0];
export let bounds = [0, 0, 0, 0];
export let currentModule = null;

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

function trueFromVisible(x, y) {
	let [px, py] = position;
	return [x - px, y - py];
}

export function clickTile(x, y) {
	if (currentModule !== null) return;
	let current = getTile(x, y).source;
	if (current.type !== null) {
		events.invalidTilePlacement();
		return;
	}

	let id = posId(x, y);
	tiles.set(id, new Tile(x, y, currentModule));
}

export function rightClickTile(x, y) {
	let current = getTile(x, y).source;
	if (current === null) return;
	let { x: tx, y: ty } = current;
	let id = posId(tx, ty);
	tiles.set(id, new Tile(tx, ty, null));
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
		} else {
			this.module = modules[module.type][module.id];
			this.image = assets.modules[module.type][module.id];
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
