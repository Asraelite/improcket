import * as game from './index.mjs';
import * as graphics from '../graphics/index.mjs';
import * as world from '../world/index.mjs';
import * as consts from '../consts.mjs';

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

export function getTile(x, y) {
	let id = posId(x, y);
	if (!tiles.has(id))
		tiles.set(id, new Tile(x, y, null));
	return tiles.get(id);
}

function posId(x, y) {
	return `${x}.${y}`;
}

function getBoundaries() {
	return [0, 0, 0, 2];
}

class Tile {
	constructor(x, y, module) {
		this.module = module;
		this.x = x;
		this.y = y;
	}

	get valid() {
		return true;
	}

	get drawPos() {
		let [px, py] = pos;
		return [this.x + px, this.y + py];
	}
}
