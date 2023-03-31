import * as spawn from './spawn.mjs';
import * as graphics from '../graphics/index.mjs';

export const entities = new Set();
export const celestials = new Set();
export const ships = new Set();
export const particles = new Set();
export const tracers = new Set();

export let playerShip = null;

export let speed = 1;

export function setPlayerShip(ship) {
	playerShip = ship;
}

export function init() {
	clear();
	spawn.player();
	let p = spawn.startPlanet();
	spawn.tick();
}

export function clear() {
	entities.clear();
	celestials.clear();
	ships.clear();
	particles.clear();
	tracers.clear();
}

export function remove(object) {
	entities.delete(object);
	celestials.delete(object);
}

export function increaseSpeed() {
	if (speed < 5) speed += 1;
}

export function decreaseSpeed() {
	if (speed > 1) speed -= 1;
}

export function tick() {
	for (let i = 0; i < speed; i++) {
		particles.forEach(p => p.tick());
		celestials.forEach(c => c.tick());
		entities.forEach(e => e.tick());
		ships.forEach(s => s.tick());
	}

	spawn.tick();
	if (graphics.trace) tracers.forEach(t => t.tick());
}
