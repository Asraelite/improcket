import {canvas, context} from './index.mjs';
import {images as assets} from '../assets.mjs';
import * as world from '../world/index.mjs';

export function render() {
	world.celestials.forEach(renderCelestial);
	world.ships.forEach(renderShip);
}

function renderShip(ship) {
	context.fillStyle = 'red';
	//context.fillRect(ship.x, ship.y, 10, 10);
	let size = 1;
		context.drawImage(assets.modules.capsule.small, ship.x, ship.y,
			size, size);
	context.drawImage(assets.modules.fuel.small, ship.x, ship.y + size,
		size, size);
	context.drawImage(assets.modules.thruster.light, ship.x,
		ship.y + size * 2, size, size);
}

const celestialImages = {
	green: Object.values(assets.celestials.green)
}

function renderCelestial(cel) {
	context.drawImage(cel.image, cel.x - cel.radius, cel.y - cel.radius,
		cel.diameter, cel.diameter);
}
