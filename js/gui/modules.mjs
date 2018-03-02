import * as gui from './index.mjs';
import {canvas} from '../graphics/index.mjs';
import GuiFrame from './frame.mjs';

export function root() {
	return new GuiFrame(0, 0, canvas.width, canvas.height, {
		draw: false
	});
}

export function titleScreen() {
	
}
