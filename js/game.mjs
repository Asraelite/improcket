import * as graphics from './graphics/index.mjs';
import * as gui from './gui/index.mjs';
import * as assets from './assets.mjs';

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

	// Recursive `requestAnimationFrame` can cause problems with Parcel.
	while(true) {
		await tick();
		await new Promise(res => requestAnimationFrame(()=>{}));
	}
}

async function tick() {
	graphics.render();
}
