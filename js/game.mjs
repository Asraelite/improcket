import * as graphics from './graphics/index.mjs';

export let game;

export function init() {
	game = {
		state: {
			room: 'menu',
			paused: false
		}
	};

	graphics.init();

	tick();
}

function tick() {
	graphics.render();
	requestAnimationFrame(tick);
}
