import {canvas, context} from './index.mjs';
import * as gui from '../gui/index.mjs';

export function render() {
	renderElement(gui.root);
}

function renderElement(element) {
	//console.log(element.options);
	if (element.options.draw) {
		if (element.type == 'frame') renderFrame(element);
		if (element.type == 'image') renderImage(element);
	}
	element.children.forEach(renderElement);
}

function renderFrame(element) {
	context.fillStyle = '#eb9';
	context.fillRect(...element.shape);
}

function renderImage(element) {
	context.drawImage(element.image, ...element.shape);
}
