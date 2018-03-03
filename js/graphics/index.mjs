import * as gui from './gui.mjs';
import * as draw from './draw.mjs';
import * as input from '../input.mjs';
import {render as renderWorld} from './world.mjs';
import {render as renderBackground} from './background.mjs';
import * as world from '../world/index.mjs';
import * as consts from '../consts.mjs';

export let canvas, context, tempCanvas, tempContext;
export let perspective;

export function init() {
	canvas = document.querySelector('#main');
	context = canvas.getContext('2d');
	tempCanvas = document.querySelector('#temp');
	tempContext = tempCanvas.getContext('2d');

	canvas.width = 600;
	canvas.height = 600;

	perspective = new Perspective();

	draw.text('Loading...', canvas.width / 2, canvas.height / 2,
		{ align: 'center', valign: 'middle' });
}

export function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	renderBackground();

	context.save();
	perspective.tick();
	perspective.transformCanvas();
	renderWorld();
	context.restore();

	gui.render();
}

export function getVisibleSectors() {
	return world.getContainedSectors(...perspective.bounds);
}

class Perspective {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.bounds = [0, 0, canvas.width, canvas.height];
		this.reset();
	}

	tick() {
		if (input.mouse.scroll !== 0) {
			this.zoomDelta(-input.mouse.scroll);
		}

		if (this.focus !== null) {
			this.x = this.focus.x;
			this.y = this.focus.y;
		}

		if (this.rotationFocus !== null) {
			this.targetRotation = this.rotationFocus.r;
		} else {
			this.targetRotation = 0;
		}

		if (this.smoothRotation) {
			this.rotation = (this.rotation * 0.9 + this.targetRotation * 0.1);
		} else {
			this.rotation = this.targetRotation;
		}
	}

	reset() {
		this.rotation = 0;
		this.targetRotation = 0;
		this.smoothRotation = false;
		this.zoom = consts.DEFAULT_ZOOM;
		this.focus = null;
		this.rotationFocus = null;
	}

	focusPlayer() {
		this.focus = world.playerShip;
		this.rotationFocus = world.playerShip;
		this.smoothRotation = false;
	}

	zoomDelta(delta) {
		let factor = 1 + (consts.ZOOM_SPEED * Math.abs(delta));
		this.zoom *= delta > 0 ? factor : 1 / factor;
		this.normalize();
	}

	normalize() {
		this.zoom = Math.max(consts.MIN_ZOOM,
			Math.min(consts.MAX_ZOOM, this.zoom));
	}

	transformCanvas() {
		let [bx, by, bw, bh] = this.bounds;
		let tx = -this.x + bw / 2;
		let ty = -this.y + bh / 2;
		context.translate(tx, ty);
		context.scale(this.zoom, this.zoom);
	}
}
