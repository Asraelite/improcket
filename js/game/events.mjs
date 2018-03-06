import * as game from './index.mjs';
import * as graphics from '../graphics/index.mjs';
import * as world from '../world/index.mjs';
import * as player from './player.mjs';
import * as inventory from './inventory.mjs';
import * as particle from '../world/particle.mjs';
import * as edit from './edit.mjs';

export let shipLanded = false;

let notification = null;
let notLife = 0;

function notify(message) {
	if (notification === null) return;
	notification.text = message;
	notLife = 60;
}

export function tick() {
	if (notification === null) return;
	if (notLife-- <= 0)
		notification.text = '';
}

export function setNotificationElement(el) {
	notification = el;
}

export function startGame() {
	game.changeView('game');
	graphics.perspective.focusPlayer();
}

export function landShip() {
	shipLanded = true;
	game.state.landed = true;
}

export function launchShip() {
	shipLanded = false;
	game.state.landed = false;
}

export function toggleEdit() {
	if (game.state.editing) {
		endEditing();
		return;
	}
	game.state.editing = true;
	game.state.inventory = true;
	edit.init();
}

export function toggleTrace() {
	let trace = graphics.toggleTrace();
	notify('Path prediction: ' + (trace ? 'on' : 'off'));
}

export function cycleRotationMode() {
	let message = {
		parent: 'planet',
		local: 'ship',
		universe: 'universe'
	}[graphics.cycleRotationMode()];

	notify('Rotation view: ' + message);
}

export function endEditing() {
	let {valid, reason} = edit.end();

	if (valid) {
		graphics.changePerspective('universe');
		game.state.editing = false;
		game.state.inventory = false;
	}
}

export function invalidTilePlacement() {
	// TODO: Play some audio.
}

export function tilePlacement() {
	// TODO: Play some audio.
}

export function tossItem() {
	particle.createItemToss(world.playerShip);
}

export function collectItem(type, id) {
	inventory.addItem(type, id);
	return true;
}
