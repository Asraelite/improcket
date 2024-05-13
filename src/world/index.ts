import * as spawn from './spawn';
import * as graphics from '../graphics/index';
import { Particle } from './particle';
import Tracer from './tracer';
import Ship from './ship';
import Celestial from './celestial';
import Entity from './entity';

export const entities: Set<Entity> = new Set();
export const celestials: Set<Celestial> = new Set();
export const ships: Set<Ship> = new Set();
export const particles: Set<Particle> = new Set();
export const tracers: Set<Tracer> = new Set();

export let playerShip: Ship = null;

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

export function tick(delta: number) {
	for (let i = 0; i < speed; i++) {
		particles.forEach(p => p.tick(delta));
		celestials.forEach(c => c.tick(delta));
		entities.forEach(e => e.tick(delta));
		ships.forEach(s => s.tick(delta));
	}

	spawn.tick();
	if (graphics.trace) tracers.forEach(t => t.tick(delta));
}
