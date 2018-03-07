import Ship from './ship.mjs';
import Module from './module.mjs';
import Celestial from './celestial.mjs';
import Entity from './entity.mjs';
import Tracer from './tracer.mjs';
import {modules} from '../data.mjs';
import * as world from './index.mjs';
import * as consts from '../consts.mjs';
import {SECTOR_SIZE as SS} from '../consts.mjs';

let spawnedSectors = new Map();

const visibleRadius = (400 / consts.MIN_ZOOM) + SS;

export function tick() {
	let [px, py] = world.playerShip.com;

	for (let x = px - visibleRadius; x < px + visibleRadius; x += SS)
	for (let y = py - visibleRadius; y < py + visibleRadius; y += SS) {
		let [sx, sy] = [x / SS | 0, y / SS | 0];
		let id = `${sx}.${sy}`;
		if (!spawnedSectors.has(id)) spawnSector(sx, sy);
	}

	spawnedSectors.forEach((objects, key) => {
		let [sx, sy] = key.split('.');
		let [wx, wy] = [sx * SS, sy * SS];
		let dis = (wx - px) ** 2 + (wy - py) ** 2;
		if (dis > (SS * 4) ** 2) {
			spawnedSectors.delete(key);
			objects.forEach(world.remove);
		}
	});
}

function nearest(x, y, set) {
	let closest = null;
	let closestDis = 0;

	set.forEach(e => {
		let dis = e.distanceTo({ com: [x, y] });
		if (closest === null || dis < closestDis) {
			closest = e;
			closestDis = dis;
		}
	});

	return [closest, closestDis];
}

function spawnSector(x, y) {
	let area = SS ** 2;
	let spawned = new Set();

	for (let i = 0; i < area / 1000; i++) {
		let [px, py] = [(x + Math.random()) * SS, (y + Math.random()) * SS];
		if (Math.random() < consts.PLANET_SPAWN_RATE / 1000) {
			spawned.add(randomPlanet(px, py));
		} else if (Math.random() < consts.ENTITY_SPAWN_RATE / 1000){
			spawned.add(randomEntity(px, py));
		}
	}

	spawnedSectors.set(`${x}.${y}`, spawned);
}

function randomPlanet(x, y, {
		radius = Math.random() * 60 + 30,
		type = 'green',
		density = 3
	} = {}) {

	let [cel, dis] = nearest(x, y, world.celestials);
	let mcs = consts.MIN_CELESTIAL_SPACING;

	if (cel !== null && dis < Math.max(radius, cel.radius) * mcs) return;

	let planet = celestial(x, y, radius, {
		density: density,
		type: type
	});

	for (let i = 0.1; i < 4; i += 1) {
		if (Math.random() > consts.ENTITY_SPAWN_RATE) {
			let e = randomEntity();
			e.orbit(planet, i * radius, Math.random() * Math.PI * 2);
		}
	}

	for (let i = 0; i < 5; i++) {
		if (Math.random() > consts.ENTITY_SPAWN_RATE || true) {
			let e = randomEntity();
			e.orbit(planet, 1.5, Math.random() * Math.PI * 2);
			e.gravity = false;
			e.halt();
		}
	}

	return planet;
}

function randomEntity(x, y) {
	let entity, type, id;

	if (Math.random() > 0.3) {
		entity = new Entity(x, y, 'fuelcan');
	} else {
		let type, id;
		while (true) {
			let arr = Object.entries(modules);
			[type, arr] = arr[Math.random() * arr.length | 0];
			arr = Object.keys(arr);
			id = arr[Math.random() * arr.length | 0];
			let value = modules[type][id].value;
			if (Math.random() < (1 / value)) break;
		}
		entity = new Entity(x, y, type, id);
	}

	world.entities.add(entity);
	return entity;
}

export function player() {
	let ship = new Ship(0, -45);
	ship.addModule(0, 0, modules.capsule.small);
	ship.addModule(0, 1, modules.fuel.small);
	ship.addModule(0, 2, modules.thruster.light);
	//ship.addModule(1, 2, modules.thruster.light);
	//ship.addModule(-1, 2, modules.thruster.light);
	world.ships.add(ship);
	world.setPlayerShip(ship);
	ship.addFuel(ship.maxFuel);

	let tracer = new Tracer(ship);
	world.tracers.add(tracer);

	return ship;
}

export function startPlanet() {
	return randomPlanet(0, 0, {
		radius: 40,
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
