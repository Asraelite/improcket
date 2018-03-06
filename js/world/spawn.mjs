import Ship from './ship.mjs';
import Module from './module.mjs';
import Celestial from './celestial.mjs';
import Entity from './entity.mjs';
import Tracer from './tracer.mjs';
import {modules} from '../data.mjs';
import * as world from './index.mjs';

export function player() {
	let ship = new Ship(0, -45);
	ship.addModule(0, 0, modules.capsule.small);
	ship.addModule(0, 1, modules.fuel.small);
	ship.addModule(0, 2, modules.thruster.light);
	//ship.addModule(1, 2, modules.thruster.light);
	//ship.addModule(-1, 2, modules.thruster.light);
	world.ships.add(ship);
	world.setPlayerShip(ship);

	let tracer = new Tracer(ship);
	world.tracers.add(tracer);

	return ship;
}

export function startPlanet() {
	return celestial(0, 0, 40, {
		density: 3,
		type: 'green'
	});
}

export function testEntity(parent) {
	let entity = new Entity(0, -50);
	world.entities.add(entity);
	entity.orbit(parent, 10);
	return entity;
}

export function celestial(x, y, radius, params) {
	let celestial = new Celestial(x - radius, y - radius, radius, params);
	world.celestials.add(celestial);
	return celestial;
}
