import {state} from './index';
import {modules} from '../data';
import {playerShip} from '../world/index';
import {images as assets} from '../assets';
import * as edit from './edit';
import * as events from './events';

export const items = new Map();
export let currentItem = null;
export let capacity = 0;
export let usedSpace = 0;

let onupdate = () => {};

export function init() {
	items.clear();
	update();
}

export function canToss() {
	return !state.editing || edit.message === 'inventory too full'
		|| edit.message === '';
}

export function getTiles() {
	let list = Array.from(items.values());
	list.sort((a, b) => toId(...a.ident) < toId(...b.ident));
	usedSpace = list.reduce((a, b) => a + b.quantity, 0);
	return list;
}

export function addItem(type, id) {
	let mapId = toId(type, id);
	if (!items.has(mapId)) items.set(mapId, new Tile(type, id));
	let tile = items.get(mapId);
	tile.increase();
	update();
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
	if (canToss())
		events.tossItem();
	update();
	edit.validate();
}

export function selectItem(type, id) {
	currentItem = items.get(toId(type, id));
	update();
}

export function setOnupdate(func) {
	onupdate = func;
}

function update() {
	capacity = playerShip.cargoCapacity;
	onupdate();
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
		this.data = modules[type][id];
		if (type === 'thruster') this.image = this.image.off;
	}

	get textInfo() {
		let text = this.data.name + '\n\n' + this.data.tooltip + '\n\n';
		text += 'Mass: ' + this.data.mass + '\n';

		if (this.type === 'thruster')
			text += 'Power: ' + this.data.thrust + '\n';
		if (this.type === 'fuel')
			text += 'Fuel capacity: ' + this.data.fuelCapacity + '\n';
		if (this.type === 'capsule') {
			text += 'Rotational power: ' + this.data.rotation + '\n';
			text += 'Cargo space: ' + this.data.capacity + '\n';
		}

		return text;
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
