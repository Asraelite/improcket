import {context} from './index.mjs';
import * as edit from '../game/edit.mjs';
import * as world from '../world/index.mjs';

export function render() {
	let ship = world.playerShip;

	context.save();
	context.translate(...ship.com);
	context.rotate(ship.r);
	let [cx, cy] = ship.localCom;

	context.translate(-cx, -cy);

	context.restore();
}
