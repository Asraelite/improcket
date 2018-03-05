import * as gui from './index.mjs';
import {images as assets} from '../assets.mjs';
import {canvas} from '../graphics/index.mjs';
import GuiFrame from './frame.mjs';
import GuiImage from './image.mjs';
import GuiButton from './button.mjs';
import GuiEdit from './edit.mjs';
import GuiInventory from './inventory.mjs';
import * as events from '../game/events.mjs';
import {state} from '../game/index.mjs';

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

export function game() {
	let shadow = root();

	let editButton = new GuiButton('Edit rocket', events.editShip, 0, 0, 200);
	shadow.append(editButton);
	editButton.posRelative({ x: 0.5, xc: 0.5, y: 1 });
	editButton.y -= 45;
	editButton.tick = () => {
		editButton.options.draw = state.landed && !state.editing;
	}

	let edit = new GuiEdit(0, 0, 0, 0);
	shadow.append(edit);
	edit.posRelative({x: 0.45, y: 0, w: 0.55, h: 0.6});
	edit.x -= 10;
	edit.y += 10;

	let inventory = new GuiInventory(0, 0, 0, 0);
	shadow.append(inventory);
	inventory.posRelative({x: 0, y: 0, w: 0.4, h: 0.6});
	inventory.x += 10;
	inventory.y += 10;

	edit.guiInventory = inventory;

	return shadow;
}
