import * as gui from './gui.mjs';
import * as draw from './draw.mjs';
import * as input from '../input.mjs';
import {render as renderWorld} from './world.mjs';
import {render as renderBackground} from './background.mjs';
import * as world from '../world/index.mjs';
import * as consts from '../consts.mjs';

const TAU = consts.TAU;

export let canvas, context, tempCanvas, tempContext;
export let perspective;
export let trace = false;
export let markers = false;

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

	context.beginPath();
	context.rect(0, 0, canvas.width, canvas.height);
	context.clip();

	context.save();
	perspective.tick();
	perspective.transformRotate();
	renderBackground(perspective.rotation);
	perspective.transformCanvas();
	renderWorld();
	context.restore();

	gui.render();
}

export function getVisibleSectors() {
	return world.getContainedSectors(...perspective.bounds);
}

export function changePerspective(rotationMode, shiftX = 0, shiftY = 0) {
	perspective.changeRotationMode(rotationMode);
	perspective.changeShift(shiftX, shiftY);
	perspective.transition = 1;
}

export function cycleRotationMode() {
	if (perspective.rotationMode === 'parent') {
		perspective.changeRotationMode('local');
	} else if (perspective.rotationMode === 'local') {
		perspective.changeRotationMode('universe');
	} else {
		perspective.changeRotationMode('parent');
	}
	perspective.transition = 1;
	return perspective.rotationMode;
}

export function toggleTrace() {
	trace = !trace;
	return trace;
}

export function toggleMarkers() {
	markers = !markers;
	return markers;
}

export function changeZoom(delta) {
	perspective.zoomDelta(delta);
}

export function setZoom(target) {
	perspective.changeZoom(target);
}

class Perspective {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.shiftX = 0;
		this.shiftY = 0;
		this.zoom = 0;
		this.bounds = [0, 0, canvas.width, canvas.height];
		this.rotationMode = 'universe';
		this.targetZoom = consts.DEFAULT_ZOOM;
		this.oldTarget = 0;
		this.oldShift = [0, 0];
		this.oldZoom = 0;
		this.transition = 0;
		this.zoomTransition = 0;
		this.reset();
	}

	changeRotationMode(mode) {
		this.oldShift = this.currentShift;
		this.oldTarget = this.currentRotation;
		this.rotationMode = mode;
	}

	changeShift(x, y) {
		this.oldShift = this.currentShift;
		[this.shiftX, this.shiftY] = [x, y];
	}

	changeZoom(zoom) {
		this.oldZoom = this.currentZoom;
		this.targetZoom = zoom;
		this.zoomTransition = 1;
	}

	get currentShift() {
		let [ox, oy] = this.oldShift;
		return [this.interpolate(this.shiftX, ox),
			this.interpolate(this.shiftY, oy)];
	}

	get currentRotation() {
		return this.interpolateAngles(this.targetRotation, this.oldTarget);
	}

	get currentZoom() {
		let t = this.zoomTransition;
		return (this.oldZoom * t + this.targetZoom * (1 - t));
	}

	interpolate(cur, old, x = this.transition) {
		return (old * x + cur * (1 - x));
	}

	interpolateAngles(cur, old, x = this.transition) {
		return old + this.angleDifference(old, cur) * (1 - x);
	}

	angleDifference(a, b) {
		return Math.atan2(Math.sin(b - a), Math.cos(b - a));
	}

	tick() {
		if (this.focus !== null)
			[this.x, this.y] = this.focus.com;

		if (this.focus === null || this.rotationMode === 'universe') {
			this.targetRotation = 0;
		} else if (this.rotationMode === 'parent') {
			let parent = this.focus.parentCelestial;
			if (parent === null) {
				this.targetRotation = 0;
			} else {
				let a = this.focus.angleTo(...this.focus.com, ...parent.com);
				this.targetRotation = a - Math.PI / 2;
			}
		} else {
			this.targetRotation = this.focus.r;
		}

		this.normalize();

		let dif = Math.abs(this.targetRotation - this.rotation);
		this.rotationMet = dif < (this.rotationMet ? 0.3 : 0.05);

		this.rotation = this.currentRotation;
		this.zoom = this.currentZoom;

		this.transition *= 0.9;
		this.zoomTransition *= 0.9;
	}

	reset() {
		this.rotation = 0;
		this.targetRotation = 0;
		this.zoom = consts.DEFAULT_ZOOM;
		this.targetZoom = this.zoom;
		this.focus = null;
		this.rotationFocus = null;
	}

	focusPlayer() {
		this.focus = world.playerShip;
		this.rotationFocus = world.playerShip;
	}

	zoomDelta(delta) {
		let factor = 1 + (consts.ZOOM_SPEED * Math.abs(delta));
		this.targetZoom *= delta > 0 ? factor : 1 / factor;
		this.normalize();
	}

	normalize() {
		this.targetZoom = Math.max(consts.MIN_ZOOM,
			Math.min(consts.MAX_ZOOM, this.targetZoom));
		this.targetRotation %= TAU;
	}

	transformRotate() {
		let [,,bw, bh] = this.bounds;
		context.translate(bw / 2, bh / 2);
		context.rotate(-this.rotation);
		context.translate(-bw / 2, -bh / 2);
	}

	rotateVector(x, y, r = this.rotation) {
		return [(x * Math.cos(r) - y * Math.sin(r)),
			(y * Math.cos(r) - x * Math.sin(r))];
	}

	transformCanvas() {
		let [,,bw, bh] = this.bounds;
		let [sx, sy] = this.rotateVector(...this.currentShift, this.rotation);
		let tx = -(this.x + sx) * this.zoom;
		let ty = -(this.y + sy) * this.zoom;
		context.translate(tx + bw / 2, ty + bh / 2);
		context.scale(this.zoom, this.zoom);
	}

	normalizeAngle(a = this.r) {
		return ((a % TAU) + TAU) % TAU;
	}
}
