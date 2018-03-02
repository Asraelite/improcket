import {game} from '../game.mjs';
import {getContainedSectors} from '../world/index.mjs';
import * as background from './background.mjs';
import * as gui from './gui.mjs';
import * as draw from './draw.mjs';

export let canvas, context, tempCanvas, tempContext;
export let view;

export function init() {
	canvas = document.querySelector('#main');
	context = canvas.getContext('2d');
	tempCanvas = document.querySelector('#temp');
	tempContext = tempCanvas.getContext('2d');

	canvas.width = 600;
	canvas.height = 600;

	view = {
		bounds: [0, 0, canvas.width, canvas.height],
		x: 0,
		y: 0,
		zoom: 1
	}

	draw.text('Loading...', canvas.width / 2, canvas.height / 2,
		{ align: 'center', valign: 'middle' });
}

export function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.save();

	// TODO: Translate canvas.

	background.render();

	context.restore();

	gui.render();
}

export function getVisibleSectors() {
	return getContainedSectors(...view.bounds);
}
