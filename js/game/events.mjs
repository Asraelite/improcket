import * as game from './index.mjs';
import * as graphics from '../graphics/index.mjs';
import * as world from '../world/index.mjs';
import * as player from './player.mjs';

export function startGame() {
	game.changeView('game');
	graphics.perspective.focusPlayer();
}
