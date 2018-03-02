import * as gui from './index.mjs';
import {images as assets} from '../assets.mjs';
import {canvas} from '../graphics/index.mjs';
import GuiFrame from './frame.mjs';
import GuiImage from './image.mjs';
import GuiButton from './button.mjs';
import * as events from '../game/events.mjs';

export function root() {
	return new GuiFrame(0, 0, canvas.width, canvas.height, {
		draw: false
	});
}

export function title() {
	let shadow = root();
	let logo = new GuiImage(assets.title.logo);
	shadow.append(logo);
	logo.scaleImage({ w: shadow.w * 0.7 });
	logo.posRelative({ x: 0.5, xc: 0.5, y: 0.2 });

	// TODO: Implement call to change view to game.
	let startFunction = events.startGame;
	let start = new GuiButton('Start game', events.startGame, 0, 0, 200);
	shadow.append(start);
	start.posRelative({ x: 0.5, xc: 0.5, y: 0.7 });

	let secondFunction = () => {};
	let second = new GuiButton('Don\'t start game', secondFunction, 0, 0, 200);
	shadow.append(second);
	second.posRelative({ x: 0.5, xc: 0.5, y: 0.7 });
	second.y += 60;

	return shadow;
}
