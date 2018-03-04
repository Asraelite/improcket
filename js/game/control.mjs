import * as input from '../input.mjs';
import * as events from './events.mjs';
import * as player from './player.mjs';
import * as graphics from '../graphics/index.mjs';
import {state} from './index.mjs';

export const mapping = {
	thrust: 'KeyW',
	left: 'KeyA',
	right: 'KeyD',
	exitEdit: 'Escape'
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
		player.ship.applyThrust({ forward: 1 });
	}

	if (held[mapping.left]) {
		player.ship.applyThrust({ turnLeft: 1 });
	}

	if (held[mapping.right]) {
		player.ship.applyThrust({ turnRight: 1 });
	}
}

function tickEditing() {
	if (held[mapping.exitEdit]) {
		events.endEditing();
	}
}
