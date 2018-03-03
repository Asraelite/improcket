import * as input from '../input.mjs';
import * as player from './player.mjs';

export const mapping = {
	thrust: 'KeyW',
	left: 'KeyA',
	right: 'KeyD'
};

export function tick() {
	let held = input.keyCode.held;
	let pressed = input.keyCode.pressed;

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
