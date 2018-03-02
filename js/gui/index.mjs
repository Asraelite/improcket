import {context} from '../graphics/index.mjs';
import * as modules from './modules.mjs';

export const elements = new Set();
export let root;

export function init() {
	elements.clear();
	root = modules.root();
	changeView('title');
}

export function tick() {
	root.tick();
}

export function changeView(view) {
	root.clear();

	if (view == 'title') {
		root.append(modules.title());
	}
}

export function measureText(msg, font) {
	context.font = font;
	let measurement = context.measureText(msg);
	return [measurement.width, measurement.height];
}
