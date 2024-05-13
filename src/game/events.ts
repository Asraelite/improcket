import * as game from './index';
import * as graphics from '../graphics/index';
import * as world from '../world/index';
import * as inventory from './inventory';
import * as particle from '../world/particle';
import * as edit from './edit';
import * as audio from './audio';
import * as consts from '../consts';

export let shipLanded = false;
export let score = 0;
export let gameOverReason = '';
export let scoreText = '';

let notification = null;
let notLife = 0;

let landedPlanets = new Set();

export function init() {
	score = 0;
	shipLanded = false;
}

export function outOfFuel() {
	gameOver('You ran out of fuel');
}

export function playMusic() {
	audio.start('music');
	audio.volume('music', 0.4);
}

export function stopMusic() {
	audio.stop('music');
}

function notify(message, time = 80) {
	if (notification === null) return;
	notification.text = message;
	notLife = time;
}

export function tick() {
	if (notification === null) return;
	if ((notLife-- <= 0 || game.state.gameOver) && !game.state.paused)
		notification.text = '';
}

export function setNotificationElement(el) {
	notification = el;
}

export function startGame() {
	init();
	game.state.gameOver = false;
	game.changeView('game');
	graphics.perspective.reset();
	graphics.perspective.focusPlayer();
}

export function toMenu() {
	game.changeView('menu');
}

export function togglePause() {
	game.state.paused = !game.state.paused;
	audio.play('pause');
	if (game.state.paused) {
		notify('Paused', 0);
	}
}

export function landShip(planet) {
	shipLanded = true;
	if (!landedPlanets.has(planet)) {
		newPlanet(planet);
	}
	game.state.landed = true;
}

export function howToPlay() {
	game.changeView('instructions');
}

function newPlanet(planet) {
	let value = (planet.radius * 2 + 50) | 0;
	landedPlanets.add(planet);
	audio.play('newPlanet');
	score += value;
	notify('Landed on new planet: +' + value);
}

export function launchShip() {
	shipLanded = false;
	game.state.landed = false;
}

export function crash() {
	gameOver('You crashed');
	audio.play('crash');
	particle.createCrash(world.playerShip);
}

export function gameOver(reason) {
	if (game.state.editing)
			endEditing();
	gameOverReason = reason;
	game.state.gameOver = true;
	game.state.inventory = false;
	game.state.editing = false;
	graphics.perspective.changeZoom(consts.MIN_ZOOM, 0.99);
	let massScore = world.playerShip.mass * 100;
	let fuelScore = world.playerShip.fuel * 50 | 0;
	let finalScore = massScore + fuelScore + score;
	scoreText = 'Ship mass:       ' +
		' '.repeat(5 - ('' + massScore).length) + massScore + '\n' +
		'Remaining fuel:  ' +
		' '.repeat(5 - ('' + fuelScore).length) + fuelScore + '\n' +
		'Score:           ' +
		' '.repeat(5 - ('' + score).length) + score + '\n\n' +
		'Final score:     ' +
		' '.repeat(5 - ('' + finalScore).length) + finalScore;
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

export function toggleMarkers() {
	let markers = graphics.toggleMarkers();
	notify('Item markers: ' + (markers ? 'on' : 'off'));
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
	audio.play('toss');
}

export function collectItem(type, id, name) {
	if (type === 'fuelcan') {
		world.playerShip.addFuel(consts.FUEL_CAN_AMOUNT);
		audio.play('fuelPickup');
		score += 10;
		notify('Collected fuel: +10');
		return true;
	} else {
		if (inventory.usedSpace >= inventory.capacity) {
			notify('No space left in inventory', 60);
			return false;
		}
		inventory.addItem(type, id);
		audio.play('itemPickup');
		score += 20;
		notify(`Collected "${name}" module: +20`, 150);
		return true;
	}
}
