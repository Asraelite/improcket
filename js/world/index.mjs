import * as sector from './sector.mjs';
import * as spawn from './spawn.mjs';

export {getSectorFromWorld, getContainedSectors} from './sector.mjs';

export const entities = new Set();
export const celestials = new Set();
export const ships = new Set();
export const particles = new Set();
export const tracers = new Set();

export let playerShip = null;

export function setPlayerShip(ship) {
	playerShip = ship;
}

export function init() {
	entities.clear();
	celestials.clear();
	ships.clear();
	particles.clear();
	tracers.clear();
	spawn.player();
	let p = spawn.startPlanet();
	spawn.testEntity(p);
}

export function tick() {
	particles.forEach(p => p.tick());
	celestials.forEach(c => c.tick());
	entities.forEach(e => e.tick());
	ships.forEach(s => s.tick());
	tracers.forEach(t => t.tick());
}
