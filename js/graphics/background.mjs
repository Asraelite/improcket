import {SeededRandom} from '../util.mjs';
import {context, view, getVisibleSectors} from './index.mjs';
import {STAR_DENSITY} from '../consts.mjs';

export function render() {
	context.fillStyle = '#000';

	getVisibleSectors().forEach(s => renderSectorStars(s));
}

function renderSectorStars(sector) {
	let rand = new SeededRandom(sector.numId);

	context.fillStyle = '#fff';

	for (let i = 0; i < STAR_DENSITY; i++) {
		let sx = rand.next() * sector.size + sector.wx;
		let sy = rand.next() * sector.size + sector.wy;
		context.fillRect(sx, sy, 1.5, 1.5);
	}
}
