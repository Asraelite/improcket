import * as graphics from '../graphics/index.mjs';
import * as gui from '../gui/index.mjs';
import * as assets from '../assets.mjs';
import * as input from '../input.mjs';
import * as inventory from './inventory.mjs';
import * as world from '../world/index.mjs';
import * as events from './events.mjs';
import * as control from './control.mjs';
import * as edit from './edit.mjs';

export let state;

export async function init() {
	state = {
		view: 'menu',
		playing: false,
		editing: false,
		paused: false,
		inventory: false,
		gameOver: false
	};

	graphics.init();
	await assets.init();
	gui.init();
	input.init();

	events.playMusic();
	//events.startGame();

	loop(tick);
}

export function changeView(view) {
	state.view = view;
	gui.changeView(view);

	if (view === 'game') {
		state.playing = true;
		state.editing = false;
		state.paused = false;
		world.init();
		edit.init();
		graphics.perspective.reset();
		inventory.init();
	} else if (view === 'instructions') {
		state.playing = false;
		gui.changeView('instructions');
	} else if (view === 'menu') {
		gui.changeView('menu');
		world.clear();
	}
}

function loop(fn, fps = 60) {
    let then = Date.now();
    let interval = 1000 / fps;

    (function loop(time) {
        requestAnimationFrame(loop);

        // again, Date.now() if it's available
        let now = Date.now();
        let delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);
            fn();
        }
    })(0);
};

function tick() {
	events.tick();

	if (state.view == 'game' && !state.paused) {
		world.tick();
	}

	control.tick();

	gui.tick();
	graphics.render();
	input.tick();
}
