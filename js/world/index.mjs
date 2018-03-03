import * as sector from './sector.mjs';
import * as spawn from './spawn.mjs';

export {getSectorFromWorld, getContainedSectors} from './sector.mjs';

export const entities = new Set();
export const celestials = new Set();
export const ships = new Set();

export let playerShip = null;

export function setPlayerShip(ship) {
	playerShip = ship;
}

export function init() {
	entities.clear();
	celestials.clear();
	spawn.player();
	spawn.startPlanet();

}

export function tick() {
	celestials.forEach(c => c.tick());
	entities.forEach(e => e.tick());
	ships.forEach(s => s.tick());
}
