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
	exitEdit: 'Escape',
	inventory: 'KeyE',
	cycleRotation: 'KeyC',
	toggleTrace: 'KeyT',
	toggleMarkers: 'KeyR'
};

let held, pressed;

export function tick() {
	held = input.keyCode.held;
	pressed = input.keyCode.pressed;

	if (state.editing) {
		tickEditing();
	} else if (state.playing) {
		tickPlaying();
	}

	if (!state.editing) {
		if (input.mouse.scroll !== 0) {
			graphics.changeZoom(-input.mouse.scroll);
		}
	}
}

function tickPlaying() {
	if (held[mapping.thrust]) {
		playerShip.applyThrust({ forward: 1 });
	} else {
		audio.stop('engine');
	}

	if (pressed[mapping.thrust]) {
		audio.start('engine');
	}

	if (held[mapping.left]) {
		playerShip.applyThrust({ turnLeft: 1 });
	}

	if (held[mapping.right]) {
		playerShip.applyThrust({ turnRight: 1 });
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

	// For debugging.
	if (pressed['KeyZ']) events.startGame();
}

function tickEditing() {
	if (pressed[mapping.exitEdit]) {
		events.endEditing();
	}
}
