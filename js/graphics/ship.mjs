import {canvas, context} from './index.mjs';
import {images as assets} from '../assets.mjs';
import * as world from '../world/index.mjs';

export function render() {
	world.ships.forEach(renderShip);
}

function renderShip(ship) {
	context.fillStyle = 'red';
	//context.fillRect(ship.x, ship.y, 10, 10);
	let size = 100;
		context.drawImage(assets.modules.capsule.small, ship.x, ship.y,
			size, size);
	context.drawImage(assets.modules.fuel.small, ship.x, ship.y + size,
		size, size);
	context.drawImage(assets.modules.thruster.light, ship.x,
		ship.y + size * 2, size, size);
}
