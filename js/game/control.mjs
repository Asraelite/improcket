import * as input from '../input.mjs';
import * as events from './events.mjs';
import * as graphics from '../graphics/index.mjs';
import * as inventory from './inventory.mjs';
import * as audio from './audio.mjs';
import * as world from '../world/index.mjs';
import {playerShip} from '../world/index.mjs';
import {state} from './index.mjs';

export const mapping = {
	thrust: 'KeyW',
	left: 'KeyA',
	right: 'KeyD',
	reduce: 'ShiftLeft',
	exitEdit: 'Escape',
	inventory: 'KeyE',
	cycleRotation: 'KeyC',
	toggleTrace: 'KeyT',
	toggleMarkers: 'KeyR',
	toggleMusic: 'KeyM',
	togglePause: 'KeyP',
	zoomIn: 'KeyZ',
	zoomOut: 'KeyX',
	increaseSpeed: 'Period',
	decreaseSpeed: 'Comma',
};

let held, pressed;

export function tick() {
	held = input.keyCode.held;
	pressed = input.keyCode.pressed;

	if (state.editing) {
		tickEditing();
	} else if (state.playing && !state.gameOver && !state.paused) {
		tickPlaying();
	}

	if (!state.editing) {
		if (input.mouse.scroll !== 0) {
			// Fix for Firefox.
			let delta = input.mouse.scroll > 0 ? -50 : 50;
			graphics.changeZoom(delta);
		}

		if (held[mapping.zoomIn]) {
			graphics.changeZoom(-10);
		}

		if (held[mapping.zoomOut]) {
			graphics.changeZoom(10);
		}

		if (pressed[mapping.togglePause] && !state.gameOver) {
			events.togglePause();
		}

		if (pressed[mapping.increaseSpeed]) {
			world.increaseSpeed();
		}

		if (pressed[mapping.decreaseSpeed]) {
			world.decreaseSpeed();
		}
	}

	if (state.gameOver) {
		audio.stop('engine');
	}

	if (pressed[mapping.toggleMusic]) {
		audio.toggle('music');
	}
}

function tickPlaying() {
	let power = held[mapping.reduce] ? 0.3 : 1;

	if (held[mapping.thrust] && playerShip.fuel !== 0) {
		playerShip.applyThrust({ forward: power });
		let vol = Math.min(0.7, graphics.perspective.zoom / 10);
		audio.volume('engine', vol);
	} else {
		audio.stop('engine');
	}

	if (pressed[mapping.thrust]) {
		if (playerShip.fuel !== 0) {
			audio.start('engine');
		} else {
			audio.stop('engine');
		}
	}

	if (held[mapping.left]) {
		playerShip.applyThrust({ turnLeft: power });
	}

	if (held[mapping.right]) {
		playerShip.applyThrust({ turnRight: power });
	}

	if (pressed[mapping.inventory]) {
		state.inventory = !state.inventory;
	}

	if (pressed[mapping.cycleRotation]) {
		events.cycleRotationMode();
	}

	if (pressed[mapping.toggleTrace]) {
		events.toggleTrace();
	}

	if (pressed[mapping.toggleMarkers]) {
		events.toggleMarkers();
	}
}

function tickEditing() {
	if (pressed[mapping.exitEdit]) {
		events.endEditing();
	}
}
