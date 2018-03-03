import {canvas, context} from './index.mjs';
import * as assets from '../assets.mjs';
import * as world from '../world/index.mjs';

export function render() {
	world.ships.forEach(renderShip);
}

function renderShip(ship) {
	context.fillStyle = 'red';
	context.fillRect(ship.x, ship.y, 10, 10);
}
