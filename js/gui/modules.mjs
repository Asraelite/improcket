import * as gui from './index.mjs';
import {images as assets} from '../assets.mjs';
import {canvas} from '../graphics/index.mjs';
import GuiFrame from './frame.mjs';
import {GuiImage} from './image.mjs';

export function root() {
	return new GuiFrame(0, 0, canvas.width, canvas.height, {
		draw: false
	});
}

export function title() {
	let shadow = root();
	let logo = new GuiImage(assets.title.logo);
	shadow.append(logo);
	logo.scaleImage({ w: shadow.w * 0.7 });
	logo.posRelative({ x: 0.5, xc: 0.5, y: 0.2 });
	console.log(logo);

	return shadow;
}
