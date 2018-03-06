import Ship from './ship.mjs';
import Module from './module.mjs';
import Celestial from './celestial.mjs';
import Entity from './entity.mjs';
import Tracer from './tracer.mjs';
import {modules} from '../data.mjs';
import * as world from './index.mjs';
import * as consts from '../consts.mjs';
import {SECTOR_SIZE as SS} from '../consts.mjs';

let spawnedSectors = new Set();

const visibleRadius = (400 / consts.MIN_ZOOM) + SS;

export function tick() {
	let [px, py] = world.playerShip.com;

	for (let x = px - visibleRadius; x < px + visibleRadius; x += SS)
	for (let y = py - visibleRadius; y < py + visibleRadius; y += SS) {
		let [sx, sy] = [x / SS | 0, y / SS | 0];
		let id = `${sx}.${sy}`;
		if (!spawnedSectors.has(id)) spawnSector(sx, sy);
	}
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

	for (let i = 0; i < area / 10000; i++) {
		let [px, py] = [(x + Math.random()) * SS, (y + Math.random()) * SS];
		if (Math.random() > consts.PLANET_SPAWN_RATE) {
			randomPlanet(px, py);
		} else if (Math.random() > 0.01 ){
			randomEntity(px, py);
		}
	}

	spawnedSectors.add(`${x}.${y}`);
}

function randomPlanet(x, y) {
	let rad = Math.random() * 60 + 30;
	let [cel, dis] = nearest(x, y, world.celestials);
	let mcs = consts.MIN_CELESTIAL_SPACING;

	if (dis < Math.max(rad, cel.radius) * mcs) return;

	let planet = celestial(x, y, rad, {
		density: 3,
		type: 'green'
	});

	for (let i = 1.5; i < 8; i += 1) {
		if (Math.random() > consts.ENTITY_SPAWN_RATE) {
			let e = randomEntity();
			e.orbit(planet, i * rad);
		}
	}
}

function randomEntity(x, y) {
	let entity = new Entity(x, y);
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
