import {context} from '../graphics/index';
import GuiElement from './element';
import * as modules from './modules';

export const elements = new Set();
export let root: GuiElement;

export function init() {
	elements.clear();
	root = modules.root();
	changeView('menu');
}

export function tick() {
	root.tickElement();
}

export function changeView(view) {
	root.clear();

	if (view === 'menu') {
		root.append(modules.title());
	}

	if (view === 'game') {
		root.append(modules.game());
	}

	if (view === 'instructions') {
		root.append(modules.instructions());
	}
}

export function measureText(msg, font) {
	context.font = font;
	let measurement = context.measureText(msg);
	return [measurement.width, measurement.height];
}
