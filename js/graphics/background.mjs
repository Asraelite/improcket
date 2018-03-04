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

export function render() {
	if (patterns === null) init();

	renderLayer(patterns.back, 0.3, 1);
	renderLayer(patterns.middle, 0.5, 0.3);
	renderLayer(patterns.front, 0.7, 0.3);
}

function renderLayer(pattern, speed = 1, scale = 1) {
	context.save();
	let [px, py] = [perspective.x * speed, perspective.y * speed];
	context.translate(-px, -py);
	context.scale(scale, scale);
	context.fillStyle = pattern;
	context.fillRect(px / scale, py / scale,
		canvas.width / scale, canvas.height / scale);
	context.restore();
}

/*
function renderSectorStars(sector) {
	let rand = new SeededRandom(sector.numId);

	context.fillStyle = '#fff';

	for (let i = 0; i < STAR_DENSITY; i++) {
		let sx = rand.next() * sector.size + sector.wx;
		let sy = rand.next() * sector.size + sector.wy;
		context.fillRect(sx, sy, 1.5, 1.5);
	}
}

function tile(img, x, y, dx = 0, dy = 0, scale = 1) {
	let [sx, sy] = [x * scale, y * scale];
	let [ex, ey] = [(x + canvas.width) * scale, (y + canvas.height) * scale];
	for (let x = sx; x < ex;) {
		let nx = (Math.floor(x / img.width) + 1) * img.width;
		nx = Math.min(nx, ex);
		let w = nx - x;

		for (let y = sy; y < ey;) {
			let ny = (Math.floor(y / img.height) + 1) * img.height;
			ny = Math.min(ny, ey);
			let h = ny - y;

			context.drawImage(img, x % img.width, y % img.height, w, h,
				dx + x, dy + y, w, h);

			y = ny;
		}

		x = nx;
	}
}
*/
