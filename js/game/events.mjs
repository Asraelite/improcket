import * as game from './index.mjs';
import * as graphics from '../graphics/index.mjs';
import * as world from '../world/index.mjs';
import * as player from './player.mjs';
import * as edit from './edit.mjs';

export let shipLanded = false;

export function startGame() {
	game.changeView('game');
	graphics.perspective.focusPlayer();
}

export function landShip() {
	shipLanded = true;
	game.state.landed = true;
}

export function launchShip() {
	shipLanded = false;
	game.state.landed = false;
}

export function editShip() {
	game.state.editing = true;
	game.state.inventory = true;
	edit.init();
}

export function endEditing() {
	let {valid, reason} = edit.end();

	if (valid) {
		graphics.changePerspective('universe');
		game.state.editing = false;
		game.state.inventory = false;
	} else {
		console.log(reason);
	}
}

export function invalidTilePlacement() {
	// TODO: Play some audio.
}

export function tilePlacement() {
	// TODO: Play some audio.
}
