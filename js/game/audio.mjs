import {audio} from '../assets.mjs';

export function play(name) {
	audio[name].cloneNode(true).play();
}
