import {canvas, context} from './index.mjs';
import * as graphics from './index.mjs';
import {images as assets} from '../assets.mjs';
import * as world from '../world/index.mjs';
import {state} from '../game/index.mjs';

export function render() {
	world.particles.forEach(renderParticle);
	world.celestials.forEach(renderCelestial);
	if (graphics.trace) world.tracers.forEach(renderTracer);
	world.ships.forEach(renderShip);
	world.entities.forEach(renderEntity);

	/*
	if (typeof window.q === 'undefined') window.q = [];
	q.forEach(p => {
		context.fillStyle = p[2];
		context.fillRect(p[0] - 0.05, p[1] - 0.05, 0.1, 0.1);
	});
	*/
}

function renderParticle(particle) {
	context.fillStyle = particle.color;
	context.fillRect(...particle.com, particle.size, particle.size);
}

function renderEntity(entity) {
	context.save();
	context.translate(...entity.com);
	let alpha = Math.max(1 - ((graphics.perspective.zoom - 1) / 2), 0) ** 2;
	if (alpha > 0 && graphics.markers) {
		context.globalAlpha = alpha;
		context.beginPath();
		context.arc(0, 0, 4, 0, 2 * Math.PI);
		context.lineWidth = 1;
		context.strokeStyle = '#31911b';
		if (entity.type === 'fuelcan')
			context.strokeStyle = '#af4021';
		context.stroke();
		context.globalAlpha = 1;
	}
	context.rotate(entity.r);
	context.drawImage(entity.image, -0.5, -0.5, 1, 1);
	context.restore();
}

function renderShip(ship) {
	context.save();
	context.translate(...ship.com);
	context.rotate(ship.r);
	let [cx, cy] = ship.localCom;
	context.translate(-cx, -cy);
	ship.modules.forEach(m => {
		let [mx, my] = [m.x, m.y];
		if (state.editing) {

		}
		context.drawImage(m.currentImage, m.x, m.y, 1, 1);
	});
	context.restore();
}

const celestialImages = {
	green: Object.values(assets.celestials.green)
}

function renderCelestial(cel) {
	context.drawImage(cel.image, cel.x, cel.y,
		cel.diameter, cel.diameter);
}

function renderTracer(tracer) {
	context.lineWidth = 0.1;
	context.strokeStyle = '#fff';
	context.beginPath();
	context.moveTo(...tracer.pos);
	let path = tracer.path;

	for (let i = 0; i < path.length; i++) {
		context.lineTo(...path[i]);
		if (i % 5 === 0 || i == path.length - 1) {
			context.stroke();
			context.globalAlpha = (1 - (i / path.length)) * 0.5;
		}
	}

	context.globalAlpha = 1;
}
