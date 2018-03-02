import * as gui from '../gui/index.mjs';

export function render() {
	
}

export function renderFrame(frame) {
	context.fillStyle = '#eb9';
	context.fillRect(frame.x, frame.y, frame.w, frame.h);
}
