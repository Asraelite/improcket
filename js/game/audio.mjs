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
	if (!playing.has(name)) return false;
	let howl = playing.get(name);
	if (howl.playing()) {
		howl.stop();
		return true;
	}
	return false;
}

export function toggle(name) {
	if (!stop(name)) start(name);
}

export function volume(name, level) {
	if (!playing.has(name)) return;
	playing.get(name).volume(level);
}
