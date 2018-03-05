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
	edit.init();
}

export function endEditing() {
	graphics.changePerspective('universe');
	game.state.editing = false;
	edit.end();
}

export function invalidTilePlacement() {
	// TODO: Play some audio.
}
