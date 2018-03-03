import {canvas, context} from './index.mjs';
import {images as assets} from '../assets.mjs';
import * as world from '../world/index.mjs';

export function render() {
	world.celestials.forEach(renderCelestial);
	world.ships.forEach(renderShip);
}

function renderShip(ship) {
	context.save();
	context.translate(ship.x, ship.y);
	context.rotate(ship.r);
	let [cx, cy] = ship.com;
	ship.modules.forEach(m => {
		context.drawImage(m.currentImage, m.x - cx, m.y - cy, 1, 1);
	});
	context.restore();
}

const celestialImages = {
	green: Object.values(assets.celestials.green)
}

function renderCelestial(cel) {
	context.drawImage(cel.image, cel.x - cel.radius, cel.y - cel.radius,
		cel.diameter, cel.diameter);
}
