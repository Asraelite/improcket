import Ship from './ship.mjs';
import Module from './module.mjs';
import Celestial from './celestial.mjs';
import {modules} from '../data.mjs';
import * as world from './index.mjs';

export function player() {
	let ship = new Ship(0, -45);
	ship.addModule(0, 0, modules.capsule.small);
	ship.addModule(0, 1, modules.fuel.small);
	ship.addModule(0, 2, modules.thruster.light);
	world.ships.add(ship);
	world.setPlayerShip(ship);
	return ship;
}

export function startPlanet() {
	return celestial(0, 0, 40, {
		density: 10,
		type: 'green'
	});
}

export function celestial(x, y, radius, params) {
	let celestial = new Celestial(x - radius, y - radius, radius, params);
	world.celestials.add(celestial);
	return celestial;
}
