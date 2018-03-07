import * as game from './index.mjs';
import * as graphics from '../graphics/index.mjs';
import * as world from '../world/index.mjs';
import * as inventory from './inventory.mjs';
import * as particle from '../world/particle.mjs';
import * as edit from './edit.mjs';
import * as audio from './audio.mjs';
import * as consts from '../consts.mjs';

export let shipLanded = false;
export let score = 0;

let notification = null;
let notLife = 0;

let landedPlanets = new Set();

function notify(message) {
	if (notification === null) return;
	notification.text = message;
	notLife = 80;
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

export function landShip(planet) {
	shipLanded = true;
	if (!landedPlanets.has(planet)) {
		newPlanet(planet);
	}
	game.state.landed = true;
}

function newPlanet(planet) {
	let value = (planet.radius + 30) | 0;
	landedPlanets.add(planet);
	score += value;
	notify('Landed on new planet: +' + value);
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
		audio.play('endEdit');
		particle.createEndEditBurst(world.playerShip);
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
	if (type === 'fuelcan') {
		world.playerShip.addFuel(consts.FUEL_CAN_AMOUNT);
		audio.play('fuelPickup');
		score += 10;
		notify('Collected fuel: +10');
		return true;
	} else {
		inventory.addItem(type, id);
		audio.play('itemPickup');
		score += 20;
		notify('Collected module: +20');
		return true;
	}
}
