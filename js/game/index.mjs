import * as graphics from '../graphics/index.mjs';
import * as gui from '../gui/index.mjs';
import * as assets from '../assets.mjs';
import * as input from '../input.mjs';

export let game;

export async function init() {
	game = {
		state: {
			room: 'menu',
			paused: false
		}
	};

	graphics.init();
	await assets.init();
	gui.init();
	input.init();

	// Recursive `requestAnimationFrame` can cause problems with Parcel.
	while(true) {
		await tick();
		await new Promise(res => requestAnimationFrame(res));
	}
}

async function tick() {
	gui.tick();
	graphics.render();
	input.tick();
}
