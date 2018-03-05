import {canvas, context} from './index.mjs';
import * as gui from '../gui/index.mjs';
import * as draw from './draw.mjs';

export function render() {
	renderElement(gui.root);
}

function renderElement(element) {
	//console.log(element.options);
	if (element.options.draw) {
		if (element.type == 'frame') renderFrame(element);
		if (element.type == 'image') renderImage(element);
		if (element.type == 'button') renderButton(element);
		if (element.type == 'edit') renderEdit(element);
		if (element.type == 'itemButton') renderItemButton(element);
		if (element.type == 'inventory') renderInventory(element);
	}

	if (element.options.drawChildren)
		element.children.forEach(renderElement);
}

function renderFrame(element) {
	context.fillStyle = '#eb9';
	context.fillRect(...element.shape);
}

function renderImage(element) {
	context.drawImage(element.image, ...element.shape);
}

function renderButton(element) {
	if (element.mouseHeld) {
		context.fillStyle = '#706244';
	} else {
		context.fillStyle = element.mouseOver ? '#ad9869' : '#917f58';
	}

	context.fillRect(...element.shape);
	context.strokeStyle = '#541';
	context.strokeWidth = 4;
	context.strokeRect(...element.shape);
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#fff';
	context.font = '12pt Consolas';
	context.fillText(element.text, ...element.center);
}

function renderItemButton(element) {
	context.globalAlpha = 0.5;
	if (element.mouseHeld || element.rightMouseHeld) {
		context.fillStyle = '#080808';
	} else {
		context.fillStyle = element.mouseOver ? '#222' : '#0e0e0e';
	}

	context.fillRect(...element.shape);
	if (element.selected) {
		context.strokeStyle = '#fff';
		context.lineWidth = 2;
	} else {
		context.strokeStyle = '#333';
		context.lineWidth = 1;
	}
	context.strokeRect(...element.shape);
	context.globalAlpha = 1;

	if (element.image) {
		let p = element.padding;
		let ox = element.x + (p / 2 * element.w);
		let oy = element.y + (p / 2 * element.h);
		let [dw, dh] = [element.w * (1 - p), element.h * (1 - p)];
		context.drawImage(element.image, ox, oy, dw, dh);
	}
}

function renderEdit(element) {

}

function renderInventory(element) {
	context.globalAlpha = 0.1;
	context.fillStyle = '#541';
	context.fillRect(...element.shape);
	context.globalAlpha = 1;
}
