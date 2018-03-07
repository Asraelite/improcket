import * as input from '../input.mjs';
import * as events from './events.mjs';
import * as graphics from '../graphics/index.mjs';
import * as inventory from './inventory.mjs';
import {playerShip} from '../world/index.mjs';
import {state} from './index.mjs';

export const mapping = {
	thrust: 'KeyW',
	left: 'KeyA',
	right: 'KeyD',
	exitEdit: 'Escape',
	inventory: 'KeyE',
	cycleRotation: 'KeyC',
	toggleTrace: 'KeyT'
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

	// For debugging.
	if (pressed['KeyR']) events.startGame();
}

function tickEditing() {
	if (pressed[mapping.exitEdit]) {
		events.endEditing();
	}
	
	if (pressed['KeyX']) throw new Error();
}
