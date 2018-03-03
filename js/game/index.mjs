import * as graphics from '../graphics/index.mjs';
import * as gui from '../gui/index.mjs';
import * as assets from '../assets.mjs';
import * as input from '../input.mjs';
import * as world from '../world/index.mjs';
import * as events from './events.mjs';
import * as control from './control.mjs';
import * as player from './player.mjs';

export let state;

export async function init() {
	state = {
		view: 'menu',
		paused: false
	};

	graphics.init();
	await assets.init();
	gui.init();
	input.init();

	//events.startGame();

	//tick(); return;

	// Recursive `requestAnimationFrame` can cause problems with Parcel.
	while(true) {
		await tick();
		await new Promise(res => requestAnimationFrame(res));
	}
}

export function changeView(view) {
	state.view = view;
	gui.changeView(view);

	if (view == 'game') {
		world.init();
		player.init();
	}
}

async function tick() {
	if (state.view == 'game') {
		world.tick();
		control.tick();
	}

	gui.tick();
	graphics.render();
	input.tick();
}
