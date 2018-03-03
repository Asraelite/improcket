import {canvas, context} from './index.mjs';
import {images as assets} from '../assets.mjs';
import * as world from '../world/index.mjs';

export function render() {
	world.celestials.forEach(renderCelestial);
	world.ships.forEach(renderShip);
	if (typeof window.q !== 'undefined') {
		context.fillStyle = 'red';
	}
}

function renderShip(ship) {
	context.save();
	context.translate(...ship.com);
	context.rotate(ship.r);
	let [cx, cy] = ship.localCom;
	context.translate(-cx, -cy);
	ship.modules.forEach(m => {
		context.drawImage(m.currentImage, m.x, m.y, 1, 1);
	});
	context.restore();
}

const celestialImages = {
	green: Object.values(assets.celestials.green)
}

function renderCelestial(cel) {
	context.drawImage(cel.image, cel.x, cel.y,
		cel.diameter, cel.diameter);
}
