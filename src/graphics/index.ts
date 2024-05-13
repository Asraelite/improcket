import * as gui from './gui';
import * as draw from './draw';
import * as input from '../input';
import { render as renderWorld } from './world';
import { render as renderBackground } from './background';
import * as world from '../world/index';
import * as consts from '../consts';

const TAU = consts.TAU;

export let canvas: HTMLCanvasElement;
export let tempCanvas: HTMLCanvasElement;
export let context: CanvasRenderingContext2D;
export let tempContext: CanvasRenderingContext2D;
export let perspective: Perspective;
export let trace = true;
export let markers = true;

export function init() {
	canvas = document.querySelector('#main');
	context = canvas.getContext('2d');
	tempCanvas = document.querySelector('#temp');
	tempContext = tempCanvas.getContext('2d');

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		canvas.style.width = window.innerWidth + 'px';
		canvas.style.height = window.innerHeight + 'px';
	}

	resizeCanvas();

	window.addEventListener('resize', resizeCanvas);

	perspective = new Perspective();

	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = '36px Courier New';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#fff';
	context.fillText('Loading...', canvas.width / 2, canvas.height / 2);
}

export function render(delta: number) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.beginPath();
	context.rect(0, 0, canvas.width, canvas.height);
	context.clip();

	context.save();
	perspective.tick(delta);
	perspective.transformRotate();
	renderBackground(perspective.rotation);
	perspective.transformCanvas();
	renderWorld();
	context.restore();

	gui.render();
}

export function getVisibleSectors() {
	// return world.getContainedSectors(...perspective.bounds);
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
		this.reset();
	}

	reset() {
		this.rotationMode = 'universe';
		this.targetZoom = consts.DEFAULT_ZOOM;
		this.oldTarget = 0;
		this.oldShift = [0, 0];
		this.shiftX = 0;
		this.shiftY = 0;
		this.oldZoom = 0;
		this.transition = 0;
		this.zoomTransition = 0;
		this.zoomTransitionSpeed = 0.9;
		this.rotation = 0;
		this.targetRotation = 0;
		this.zoom = consts.DEFAULT_ZOOM;
		this.targetZoom = this.zoom;
		this.focus = null;
		this.rotationFocus = null;
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

	changeZoom(zoom, speed = 0.9) {
		this.oldZoom = this.currentZoom;
		this.targetZoom = zoom;
		this.zoomTransition = 1;
		this.zoomTransitionSpeed = speed;
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

	tick(delta: number) {
		this.bounds = [0, 0, canvas.width, canvas.height];

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

		this.rotation = this.currentRotation;
		this.zoom = this.currentZoom;

		this.transition *= 0.9 ** delta;
		this.zoomTransition *= this.zoomTransitionSpeed;
	}

	focusPlayer() {
		this.focus = world.playerShip;
		this.rotationFocus = world.playerShip;
	}

	zoomDelta(delta) {
		let factor = 1 + (consts.ZOOM_SPEED * Math.abs(delta));
		let target = this.targetZoom * (delta > 0 ? factor : 1 / factor);
		this.changeZoom(target, 0.7);
		this.normalize();
	}

	normalize() {
		this.targetZoom = Math.max(consts.MIN_ZOOM,
			Math.min(consts.MAX_ZOOM, this.targetZoom));
		this.targetRotation %= TAU;
	}

	transformRotate() {
		let [, , bw, bh] = this.bounds;
		context.translate(bw / 2, bh / 2);
		context.rotate(-this.rotation);
		context.translate(-bw / 2, -bh / 2);
	}

	rotateVector(x, y, r = this.rotation) {
		return [(x * Math.cos(r) - y * Math.sin(r)),
		(y * Math.cos(r) - x * Math.sin(r))];
	}

	transformCanvas() {
		let [, , bw, bh] = this.bounds;
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
