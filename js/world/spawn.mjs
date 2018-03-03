import Ship from './ship.mjs';
import Module from './module.mjs';
import Celestial from './ship.mjs';
import {modules} from '../data.mjs';
import * as world from './index.mjs';

export function player() {
	let ship = new Ship(0, 0);
	ship.addModule(0, 0, modules.capsule.small);
	ship.addModule(0, 1, modules.fuel.small, { filled: true });
	ship.addModule(0, 2, modules.thruster.light);
	world.ships.add(ship);
	world.setPlayerShip(ship);
}

// Make module length = 1, define all other length off that.
export function celestial() {
	let celestial = new Celestial(0, 50, 45)
}
