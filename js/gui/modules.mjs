import * as gui from './index.mjs';
import {message as editMessage} from '../game/edit.mjs';
import {images as assets} from '../assets.mjs';
import {canvas} from '../graphics/index.mjs';
import GuiFrame from './frame.mjs';
import GuiImage from './image.mjs';
import GuiButton from './button.mjs';
import GuiEdit from './edit.mjs';
import GuiText from './text.mjs';
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

	let editButton = new GuiButton('Edit rocket', events.toggleEdit, 0, 0, 200);
	shadow.append(editButton);
	editButton.posRelative({ x: 0.5, xc: 0.5, y: 1 });
	editButton.y -= 45;
	editButton.tick = () => {
		editButton.options.draw = state.landed;
		editButton.options.disabled = state.editing && editMessage !== '';
		if (state.editing) {
			editButton.text = 'Finish';
		} else {
			editButton.text = 'Edit rocket';
		}
	}

	let editShadow = root();
	shadow.append(editShadow);
	editShadow.posRelative({x: 0.45, y: 0, w: 0.55, h: 0.6});
	editShadow.x -= 10;
	editShadow.y += 10;

	let edit = new GuiEdit(0, 0, 0, 0);
	editShadow.append(edit);
	edit.posRelative({w: 1, h: 1});

	let editInfoText = new GuiText('', 0, 0, 0, 0, {
		size: 12,
		align: 'center'
	});
	editShadow.append(editInfoText);
	editInfoText.posRelative({x: 0.5, y: 1});
	editInfoText.y += 5;

	let editWarnText = new GuiText('', 0, 0, 0, 0, {
		size: 12,
		align: 'center'
	});
	editShadow.append(editWarnText);
	editWarnText.posRelative({x: 0.5, y: 1});
	editWarnText.y += 20;

	edit.textElements = {
		info: editInfoText,
		warn: editWarnText
	};


	let invShadow = root();
	shadow.append(invShadow);
	invShadow.posRelative({x: 0, w: 0.4, h: 0.6});
	invShadow.x += 10;
	invShadow.y += 10;

	let inventory = new GuiInventory(0, 0, 0, 0);
	invShadow.append(inventory);
	inventory.posRelative({w: 1, h: 1});

	let moduleInfo = new GuiText('test\nline\n', 0, 0, 0, 0, {
		size: 12,
		align: 'left',
		valign: 'top'
	});
	invShadow.append(moduleInfo);
	moduleInfo.posRelative({x: 0, y: 1, w: 1});
	moduleInfo.splitLines();
	moduleInfo.y += 5;
	inventory.guiInfo = moduleInfo;

	edit.guiInventory = inventory;


	let notification = new GuiText('', 0, 0, 0, 0, {
		size: 14,
		align: 'center',
		valign: 'top'
	});
	shadow.append(notification);
	notification.posRelative({x: 0.5});
	notification.y += 10;
	events.setNotificationElement(notification);

	return shadow;
}
