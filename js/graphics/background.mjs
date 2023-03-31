import {canvas, context, perspective} from './index.mjs';
import {images as assets} from '../assets.mjs';

let patterns = null;

function init() {
	patterns = {
		back: context.createPattern(assets.background.back, 'repeat'),
		middle: context.createPattern(assets.background.middle, 'repeat'),
		front: context.createPattern(assets.background.front, 'repeat')
	};
}

export function render(angle) {
	if (patterns === null) init();
	// renderLayer(patterns.back, 0.3, 1, angle);
	// renderLayer(patterns.middle, 0.5, 0.3, angle);
	// renderLayer(patterns.front, 0.7, 0.3, angle);
}

function renderLayer(pattern, speed = 1, scale = 1, angle = 0) {
	context.save();
	let outset = (Math.abs(Math.cos(angle)) + Math.abs(Math.sin(angle)));
	outset = ((outset - 1) * canvas.width) / scale;
	let [px, py] = [perspective.x * speed, perspective.y * speed];
	context.translate(-px, -py);
	context.scale(scale, scale);
	context.fillStyle = pattern;
	context.fillRect(px / scale - outset / 2, py / scale - outset / 2,
		canvas.width / scale + outset, canvas.height / scale + outset);
	context.restore();
}
