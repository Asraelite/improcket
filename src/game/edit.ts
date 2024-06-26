import * as game from './index';
import * as graphics from '../graphics/index';
import * as world from '../world/index';
import * as consts from '../consts';
import * as events from './events';
import * as inventory from './inventory';
import {modules} from '../data';
import {images as assets} from '../assets';

export let tiles = new Map();
export let width = 0;
export let height = 0;
export let position = [0, 0];
export let bounds = [0, 0, 0, 0];
export let message = '';
export let info = '';

export function init() {
	let ship = world.playerShip;
	let modules = ship.modules;

	tiles.clear();

	modules.forEach(m => {
		let pos = [m.x, m.y];
		tiles.set(posId(...pos), new Tile(...pos, m));
	});

	message = '';
	adjustSize();

	adjustGraphics();
}

function adjustGraphics() {
	let neededZoom = graphics.canvas.width / (Math.max(width, height) + 10);
	graphics.changePerspective('planet', 0, -3);
	graphics.setZoom(neededZoom);
}

function adjustSize() {
	let margin = consts.EDIT_MARGIN;
	let [sx, ex, sy, ey] = getBoundaries();
	[width, height] = [ex - sx + margin * 2 + 1, ey - sy + margin * 2 + 1];
	position = [sx - margin, sy - margin];
	getAttributes();
}

export function end() {
	let result = validate();

	result = {
		valid: result === false,
		reason: result
	};

	if (result.valid) {
		let ship = world.playerShip;
		let [ox, oy] = ship.com;
		ship.clearModules();
		tiles.forEach(t => {
			if (t.type === null) return;
			ship.addModule(t.x, t.y, modules[t.type][t.id]);
		});
		let [nx, ny] = ship.com;
		let [dx, dy] = [nx - ox, ny - oy];
		ship.x -= dx;
		ship.y -= dy;
		const [rdx, rdy] = ship.rotateVector(dx, dy);
		ship.x -= rdx;
		ship.y -= rdy;
	}

	return result;
}

function getAttributes() {
	let cargo = 0;
	let fuel = 0;
	let rotation = 0;
	let mass = 0;
	let thrust = 0;
	let computation = 0;

	tiles.forEach(t => {
		if (t.type === null) return;
		if (t.type === 'fuel') {
			fuel += t.module.fuelCapacity;
		} else if (t.type === 'capsule') {
			rotation += t.module.rotation;
			cargo += t.module.capacity;
			computation += t.module.computation;
		} else if (t.type === 'thruster') {
			thrust += t.module.thrust;
		} else if (t.type === 'gyroscope') {
			rotation += t.module.rotation;
		} else if (t.type === 'cargo') {
			cargo += t.module.capacity;
		} else if (t.type === 'nafivation') {
			computation += t.module.computation;
		}
		mass += t.module.mass;
	});

	info = 'Mass: ' + mass + '\n' +
		'Fuel capacity: ' + fuel + '\n' +
		'Thrust/mass ratio: ' + (thrust / Math.max(mass, 1)).toFixed(1) + '\n' +
		'Rotation speed: ' + (rotation / Math.max(mass, 1) * 100).toFixed(1)
			+ '\n' +
		'Cargo capacity: ' + cargo + '\n' +
		'Navigational computation: ' + computation;
}

export function validate() {
	let capsulesFound = 0;
	let thrustersFound = 0;
	let fuelFound = 0;
	let unvisited = new Set();

	tiles.forEach(t => {
		if (t.type !== null) unvisited.add(t)
	});

	let reason = '';

	if (unvisited.size == 0) {
		reason = 'no capsule';
	}

	let visit = (tile) => {
		unvisited.delete(tile);
		if (tile.type == 'capsule') capsulesFound++;
		if (tile.type == 'thruster') thrustersFound++;
		if (tile.type == 'fuel') fuelFound++;
		tile.neighbours.forEach(n => {
			if (unvisited.has(n) && n.neighbours.indexOf(tile) > -1) {
				visit(n);
			}
		});
	};

	if (unvisited.size > 0)
		visit(unvisited.values().next().value);

	if (unvisited.size > 0) {
		reason = 'not connected'
	} else if (capsulesFound === 0) {
		reason = 'no capsule'
	} else if (thrustersFound === 0) {
		reason = 'no thruster'
	} else if (fuelFound === 0) {
		reason = 'no fuel tank'
	} else if (inventory.usedSpace > inventory.capacity) {
		reason = 'inventory too full';
	} else {
		reason = false;
	}

	if (reason === false) {
		message = '';
	} else {
		message = reason;
	}

	return reason;
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
	adjustSize();
	validate();
}

export function rightClickTile(x, y) {
	let current = getTile(x, y).source;
	if (current.type === null) return;
	let { x: tx, y: ty } = current;
	let id = posId(tx, ty);
	tiles.set(id, new Tile(tx, ty, null));
	inventory.addItem(current.type, current.id);
	adjustSize();
	validate();
}

export function getTile(x, y) {
	let [px, py] = position;
	return getRawTile(px + x, py + y);
}

export function getRawTile(x, y) {
	let id = posId(x, y);
	if (!tiles.has(id))
		tiles.set(id, new Tile(x, y, null));
	return tiles.get(id);
	// TODO: Get linked tiles.
}

function posId(x, y) {
	return `${x}.${y}`;
}

function getBoundaries() {
	let sx = null;
	let sy = null;
	let ex = null;
	let ey = null;

	tiles.forEach(t => {
		if (t.type === null) return;
		if (sx === null || t.x < sx) sx = t.x;
		if (ex === null || t.x > ex) ex = t.x;
		if (sy === null || t.y < sy) sy = t.y;
		if (ey === null || t.y > ey) ey = t.y;
	});
	return [sx, ex, sy, ey];
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

	get neighbours() {
		return [[0, -1], [1, 0], [0, 1], [-1, 0]].filter((_, i) => {
			return this.module.connectivity[i];
		}).map(([dx, dy]) => getRawTile(this.x + dx, this.y + dy));
	}

	get source() {
		return this;
	}

	get drawPos() {
		let [px, py] = pos;
		return [this.x + px, this.y + py];
	}
}
