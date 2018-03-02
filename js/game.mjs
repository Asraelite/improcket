import * as graphics from './graphics/index.mjs';
import * as gui from './gui/index.mjs';

export let game;

export async function init() {
	game = {
		state: {
			room: 'menu',
			paused: false
		}
	};

	graphics.init();
	gui.init();

	// Recursive `requestAnimationFrame` can cause problems with Parcel.
	while(true) {
		await tick();
		await new Promise(res => requestAnimationFrame(res));
	}
}

async function tick() {
	graphics.render();
}
