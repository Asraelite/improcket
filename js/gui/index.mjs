import {context} from '../graphics/index.mjs';
import * as modules from './modules.mjs';

export const elements = new Set();
export let root;

export function init() {
	elements.clear();
	root = modules.root();
	console.log(root);
}

export function measureText(msg, font) {
	context.font = font;
	let measurement = context.measureText(msg);
	return [measurement.width, measurement.height];
}
