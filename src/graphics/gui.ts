import {canvas, context} from './index';
import * as gui from '../gui/index';
import * as draw from './draw';

export function render() {
	renderElement(gui.root);
}

function renderElement(element) {
	if (element.options.draw) {
		if (element.type === 'frame') renderFrame(element);
		if (element.type === 'image') renderImage(element);
		if (element.type === 'button') renderButton(element);
		if (element.type === 'edit') renderEdit(element);
		if (element.type === 'itemButton') renderItemButton(element);
		if (element.type === 'inventory') renderInventory(element);
		if (element.type === 'text') renderText(element);
	}

	if (element.options.drawChildren)
		element.children.forEach(renderElement);
}

function renderFrame(element) {
	context.fillStyle = '#a3977c';
	context.fillRect(...element.shape);
	context.lineWidth = 3;
	context.strokeStyle = '#6d634b'
	context.strokeRect(...element.shape);
}

function renderImage(element) {
	context.drawImage(element.image, ...element.shape);
}

function renderText(element) {
	context.font = element.font;
	context.textAlign = element.align;
	context.textBaseline = element.valign;
	context.fillStyle = element.color;
	element.text.split('\n').forEach((line, i) =>
		context.fillText(line, element.x, element.y + i * element.spacing)
	);
}

function renderButton(element) {
	if (element.mouseHeld && !element.options.disabled) {
		context.fillStyle = '#706244';
	} else if (element.mouseOver && !element.options.disabled) {
		context.fillStyle = '#ad9869';
	} else {
		context.fillStyle = '#917f58';
	}

	if (element.options.disabled) {
		context.globalAlpha = 0.5;
	}

	let [sx, sy, w, h] = element.shape;
	let [ex, ey] = [sx + w, sy + h];
	let rad = 5;

	context.beginPath();
	context.moveTo(sx + rad, sy);
	context.lineTo(ex - rad, sy);
	context.quadraticCurveTo(ex, sy, ex, sy + rad);
	context.lineTo(ex, ey - rad);
	context.quadraticCurveTo(ex, ey, ex - rad, ey);
	context.lineTo(sx + rad, ey);
	context.quadraticCurveTo(sx, ey, sx, ey - rad);
	context.lineTo(sx, sy + rad);
	context.quadraticCurveTo(sx, sy, sx + rad, sy);
	context.closePath();

	context.fill();
	context.strokeStyle = '#541';
	context.lineWidth = 2;
	context.stroke();

	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#fff';
	context.font = '12pt Courier New';
	context.fillText(element.text, ...element.center);

	context.globalAlpha = 1;
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

	if (element.quantity > 1) {
		context.textAlign = 'right';
		context.textBaseline = 'bottom';
		context.fillStyle = '#fff';
		context.font = 'bold 10pt Courier New';
		let [ex, ey] = element.end;
		context.fillText('x' + element.quantity, ex - 2, ey - 2);
	}
}

function renderEdit(element) {

}

function renderInventory(element) {
	context.globalAlpha = 0.1;
	context.fillStyle = '#541';
	context.fillRect(...element.parent.shape);
	context.globalAlpha = 1;
}
