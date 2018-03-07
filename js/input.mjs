import {canvas} from './graphics/index.mjs';

export const mouse = { pressed: {}, held: {}, x: 0, y: 0, scroll: 0 };
export const keyCode = { pressed: {}, held: {} };
export const key = { pressed: {}, held: {} };
export const action = {};

const mapping = {};

export function tick() {
	mouse.pressed = {};
	keyCode.pressed = {};
	key.pressed = {};
	mouse.scroll = 0;
}

export function init() {
	window.addEventListener('keydown', event => {
		keyCode.pressed[event.code] = !keyCode.held[event.code];
		keyCode.held[event.code] = true;
		key.pressed[event.key] = !keyCode.held[event.key];
		key.held[event.key] = true;
	});

	window.addEventListener('keyup', event => {
		keyCode.held[event.code] = false;
		key.held[event.key] = false;
	});
	// Ṕ͕͖ẖ̨’̖̺͓̪̹n̼͇͔̯̝̖g̙̩̭͕ͅͅl̻̰͘u͎̥͍̗ͅi̼̞̪̩͚̜͖ ̫̝̻͚͟m͎̳̙̭̩̩̕g̟̤̬̮l̫̕w̶͚͈͚̟͔’͖n͏̝͖̞̺ͅa͏̹͓̬̺f̗̬̬̬̖̫͜h͙̘̝̱̬̗͜ ̼͎͖C̱͔̱͖ṭ̬̱͖h̵̰̼̘̩ùlh̙́u̪̫ ̪̺̹̙̯R̞͓̹̞’͍͎͉͎̦͙ͅl͇̠̮y̙̪̰̪͙̖e̢̩͉͙̼h̗͔̹̳ ̶w̨̼͍̝̭̣̣ͅg̶̳̦̳a̴͉̹͙̭̟ͅh͈͎̞̜͉́’̼̜̠͞n̲a̯g̮͚͓̝l̠ ̹̹̱͙̝f̧̝͖̱h̪̟̻͖̖t͎͘aͅg̤̘͜n̶͈̻̻̝̳
	window.addEventListener('mousedown', event => {
		mouse.pressed[event.button] = !mouse.held[event.button];
		mouse.held[event.button] = true;
		tickAfterMouse = false;
	});

	window.addEventListener('mouseup', event => {
		mouse.held[event.button] = false;
	});

	window.addEventListener('mousemove', event => {
		let rect = canvas.getBoundingClientRect();
		mouse.x = event.clientX - rect.left;
		mouse.y = event.clientY - rect.top;
	});

	window.addEventListener('wheel', event => {
		mouse.scroll = event.deltaY;
	});

	window.addEventListener('contextmenu', event => {
		event.preventDefault();
	});
}
