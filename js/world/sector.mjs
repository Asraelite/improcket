import {SECTOR_SIZE} from '../consts.mjs';

const sectors = new Map();

export default class Sector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = SECTOR_SIZE;
		this.wx = this.size * this.x;
		this.wy = this.size * this.y;
		this.id = getId(this.x, this.y);
		this.numId = getNumId(this.x, this.y);
	}

	containsPoint(wx, wy) {
		return wx >= this.wx && wy >= this.wy &&
			wx < this.wx + SECTOR_SIZE && wy < this.wy + SECTOR_SIZE;
	}
}

function getId(x, y) {
	return `${x}.${y}`;
}

function getNumId(x, y) {
	return Math.abs(x + (y * 3665)) % Number.MAX_SAFE_INTEGER;
}

export function getSector(x, y) {
	if (!sectors.has(getId(x, y))) {
		sectors.set(getId(x, y), new Sector(x, y));
	}

	return sectors.get(getId(x, y));
}

export function getSectorFromWorld(wx, wy) {
	return getSector(wx / SECTOR_SIZE | 0, wy / SECTOR_SIZE | 0);
}

export function getContainedSectors(startX, startY, endX, endY) {
	let sectors = [];

	for (let x = startX; x < endX; x += SECTOR_SIZE)
	for (let y = startY; y < endY; y += SECTOR_SIZE) {
		sectors.push(getSectorFromWorld(x, y));
	}

	return sectors;
}
