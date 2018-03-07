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
	toggleMarkers: 'KeyR',
	toggleMusic: 'KeyM'
};

let held, pressed;

export function tick() {
	held = input.keyCode.held;
	pressed = input.keyCode.pressed;

	if (state.editing) {
		tickEditing();
	} else if (state.playing && !state.gameOver) {
		tickPlaying();
	}

	if (!state.editing) {
		if (input.mouse.scroll !== 0) {
			graphics.changeZoom(-input.mouse.scroll);
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
	if (held[mapping.thrust] && playerShip.fuel !== 0) {
		playerShip.applyThrust({ forward: 1 });
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
