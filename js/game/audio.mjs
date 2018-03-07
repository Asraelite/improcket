import {audio} from '../assets.mjs';

const playing = new Map();

export function play(name) {
	audio[name].play();
}

export function start(name) {
	if (!playing.has(name))
		playing.set(name, audio[name]);

	let howl = playing.get(name);
	howl.loop(true);
	howl.play();
}

export function stop(name) {
	if (!playing.has(name)) return;
	let howl = playing.get(name);
	if (howl.playing())
		howl.stop();
}
