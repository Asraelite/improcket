import { canvas, context } from './index';
import * as graphics from './index';
import { images as assets } from '../assets';
import * as world from '../world/index';
import { state } from '../game/index';

export function render() {
	for (const particle of world.particles) renderParticle(particle);
	for (const celestial of world.celestials) if (isVisible(celestial)) renderCelestial(celestial);
	if (graphics.trace) {
		for (const tracer of world.tracers) renderTracer(tracer);
	}
	for (const ship of world.ships) renderShip(ship);
	for (const entity of world.entities) if (isVisible(entity)) renderEntity(entity);

	/*
	if (typeof window.q === 'undefined') window.q = [];
	q.forEach(p => {
		context.fillStyle = p[2];
		context.fillRect(p[0] - 0.05, p[1] - 0.05, 0.1, 0.1);
	});
	*/
}

function isVisible(body) {
	const [bx, by] = body.com;
	const [px, py] = [graphics.perspective.x, graphics.perspective.y];
	const [, , w, h] = graphics.perspective.bounds;
	const [centerX, centerY] = [px, py];
	const margin = 1000;
	return bx > centerX - margin && bx < centerX + margin &&
		by > centerY - margin && by < centerY + margin;
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
	if (ship.crashed) return;
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
};

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
