import * as gui from './index';
import {message as editMessage} from '../game/edit';
import {images as assets} from '../assets';
import {canvas} from '../graphics/index';
import GuiFrame from './frame';
import GuiImage from './image';
import GuiButton from './button';
import GuiEdit from './edit';
import GuiText from './text';
import GuiInventory from './inventory';
import * as inventory from '../game/inventory';
import * as events from '../game/events';
import {state} from '../game/index';
import * as world from '../world/index';

export function root() {
	return new GuiFrame(0, 0, () => canvas.width, () => canvas.height, {
		draw: false,
		name: 'root',
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
	start.posRelative({ x: 0.5, xc: 0.5, y: 1 });
	start.y -= 160;

	let secondFunction = () => {};
	let second = new GuiButton('Don\'t start game', secondFunction, 0, 0, 200);
	shadow.append(second);
	second.posRelative({ x: 0.5, xc: 0.5, y: 1 });
	second.y -= 110;

	let thirdFunction = events.howToPlay;
	let third = new GuiButton('How to play', thirdFunction, 0, 0, 200);
	shadow.append(third);
	third.posRelative({ x: 0.5, xc: 0.5, y: 1 });
	third.y -= 60;

	return shadow;
}

const instructionText = `\
Flight controls

WAD: Movement
Shift + WAD: Fine movement
E: Open/close inventory
R: Toggle item markers
T: Toggle path prediction
P: Pause/unpause
M: Toggle music


Ship editing and inventory controls

Left click: Select module in inventory
Right click: Toss away module in inventory
Left click: Place module on ship
Right click: Remove module from ship
Escape: Exit ship editing screen


Fly around collecting modules and fuel, and land to build your ship using \
those collected modules. Get the highest score possible without crashing or \
running out of fuel.
`;

export function instructions() {
	let shadow = root();

	let frame = new GuiFrame();
	shadow.append(frame);
	frame.posRelative({x: 0.1, y: 0.1, w: 0.8, h: 0.8});

	let back = new GuiButton('Return to menu', events.toMenu, 0, 0, 200);
	frame.append(back);
	back.posRelative({ x: 0.5, xc: 0.5, y: 1 });
	back.y -= 60;

	let text = new GuiText(instructionText, 0, 0, 0, 0, {
		size: 12,
		align: 'left',
		valign: 'top'
	});
	frame.append(text);
	text.posRelative({x: 0.05, y: 0.05, w: 0.9, h: 0.9});
	text.splitLines();

	return shadow;
}

export function game() {
	let shadow = root();

	let editButton = new GuiButton('Edit rocket', events.toggleEdit, 0, 0, 200);
	shadow.append(editButton);
	editButton.posRelative({ x: 0.5, xc: 0.5, y: 1 });
	editButton.y -= 45;
	editButton.tick = () => {
		let usable = state.landed && !state.gameOver;
		editButton.options.draw = usable;
		editButton.options.disabled = usable && editMessage !== '';
		if (state.editing) {
			editButton.text = 'Finish';
			if (editMessage !== '') editButton.text = '(' + editMessage + ')';
		} else {
			editButton.text = 'Edit rocket';
		}
	}

	let fuel = new GuiText('', 0, 0, 0, 0, {
		size: 14,
		align: 'right',
		valign: 'bottom'
	});
	shadow.append(fuel);
	fuel.posRelative({x: 1, y: 1});
	fuel.y -= 10;
	fuel.x -= 10;
	fuel.tick = () => {
		let ship = world.playerShip;
		fuel.text = 'Fuel: ' + ship.fuel.toFixed(1) + '/' +
			ship.maxFuel.toFixed(1);
	};

	let speed = new GuiText('', 0, 0, 0, 0, {
		size: 14,
		align: 'right',
		valign: 'bottom',
		
	});
	shadow.append(speed);
	speed.posRelative({x: 1, y: 1});
	speed.y -= 30;
	speed.x -= 10;
	speed.tick = () => {
		speed.text = 'Speed: ' + world.speed.toFixed(1) + 'x';
	};

	let score = new GuiText('', 0, 0, 0, 0, {
		size: 14,
		align: 'left',
		valign: 'bottom'
	});
	shadow.append(score);
	score.posRelative({x: 0, y: 1});
	score.y -= 10;
	score.x += 10;
	score.tick = () => {
		score.text = 'Score: ' + events.score
	};


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
		align: 'right'
	});
	editShadow.append(editInfoText);
	editInfoText.posRelative({x: 1, y: 1});
	editInfoText.y += 5;
	editInfoText.x -= 20;

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

	let invElement = new GuiInventory(0, 0, 0, 0);
	invShadow.append(invElement);
	invElement.posRelative({w: 1, h: 0.8});

	let capacityInfo = new GuiText('', 0, 0, 0, 0, {
		size: 12,
		align: 'left',
		valign: 'bottom'
	});
	invShadow.append(capacityInfo);
	capacityInfo.posRelative({x: 0, y: 1});
	capacityInfo.y -= 5;
	capacityInfo.x += 5;
	capacityInfo.tick = () => {
		capacityInfo.text = 'Space used: ' + inventory.usedSpace + ' / ' +
			inventory.capacity;
	};

	let moduleInfo = new GuiText('', 0, 0, 0, 0, {
		size: 12,
		align: 'left',
		valign: 'top'
	});
	invShadow.append(moduleInfo);
	moduleInfo.posRelative({x: 0, y: 1, w: 1});
	moduleInfo.splitLines();
	moduleInfo.y += 5;
	invElement.guiInfo = moduleInfo;

	edit.guiInventory = invElement;


	let notification = new GuiText('', 0, 0, 0, 0, {
		size: 14,
		align: 'center',
		valign: 'top'
	});
	shadow.append(notification);
	notification.posRelative({x: 0.5});
	notification.y += 10;
	events.setNotificationElement(notification);


	let gameOver = root();
	shadow.append(gameOver);
	gameOver.posRelative({x: 0.2, y: 0.2, w: 0.6, h: 0.6});

	let gameOverMain = new GuiText('Game over', 0, 0, 0, 0, {
		size: 48,
		align: 'center',
		valign: 'top'
	});
	gameOver.append(gameOverMain);
	gameOverMain.posRelative({x: 0.5});
	gameOverMain.y += 10;
	gameOver.tick = () => {
		gameOver.options.drawChildren = state.gameOver;
	};

	let gameOverReason = new GuiText('', 0, 0, 0, 0, {
		size: 14,
		align: 'center',
		valign: 'top'
	});
	gameOver.append(gameOverReason);
	gameOverReason.posRelative({x: 0.5});
	gameOverReason.y += 100;
	gameOverReason.tick = () => {
		gameOverReason.text = events.gameOverReason;
	};

	let gameOverScore = new GuiText('', 0, 0, 0, 0, {
		size: 14,
		align: 'center',
		valign: 'top'
	});
	gameOver.append(gameOverScore);
	gameOverScore.posRelative({x: 0.5});
	gameOverScore.y += 200;
	gameOverScore.tick = () => {
		gameOverScore.text = events.scoreText;
	};

	let gameOverExit = new GuiButton('Main menu', events.toMenu, 0, 0, 200);
	gameOver.append(gameOverExit);
	gameOverExit.posRelative({ x: 0.5, xc: 0.5, y: 1 });
	gameOverExit.y -= 10;

	return shadow;
}
