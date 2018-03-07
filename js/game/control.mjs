import * as input from '../input.mjs';
import * as events from './events.mjs';
import * as graphics from '../graphics/index.mjs';
import * as inventory from './inventory.mjs';
import * as audio from './audio.mjs';
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
	togglePause: 'KeyP'
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
			graphics.changeZoom(-input.mouse.scroll);
		}

		if (pressed[mapping.togglePause] && !state.gameOver) {
			events.togglePause();
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
