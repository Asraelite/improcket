import {modules} from '../data.mjs';
import {images as assets} from '../assets.mjs';
import * as events from './events.mjs';

export const items = new Map();
export let currentItem = null;

export function init() {
	items.clear();
}

export function getTiles() {
	let list = Array.from(items.values());
	list.sort((a, b) => toId(...a.ident) < toId(...b.ident));
	return list;
}

export function addItem(type, id) {
	let mapId = toId(type, id);
	if (!items.has(mapId)) items.set(mapId, new Tile(type, id));
	let tile = items.get(mapId);
	tile.increase();
}

export function removeItem(type, id) {
	let mapId = toId(type, id);
	if (!items.has(mapId)) return;
	let tile = items.get(mapId);
	tile.decrease();
	if (tile.quantity == 0) {
		items.delete(mapId);
		currentItem = null;
	}
	events.tossItem();
}

export function selectItem(type, id) {
	currentItem = items.get(toId(type, id));
}

function toId(type, id) {
	return `${type}.${id}`;
}

class Tile {
	constructor(type, id, q = 0) {
		this.type = type;
		this.id = id;
		this.mapId = toId(type, id);
		this.quantity = q;
		this.image = assets.modules[type][id];
		if (type === 'thruster') this.image = this.image.off;
	}

	get ident() {
		return [this.type, this.id];
	}

	increase() {
		this.quantity++;
	}

	decrease() {
		this.quantity = Math.max(0, this.quantity - 1);
	}
}
