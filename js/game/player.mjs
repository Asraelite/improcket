import * as world from '../world/index.mjs';
import * as inventory from './inventory.mjs';

export let ship;

export function init() {
	ship = world.playerShip;
}
