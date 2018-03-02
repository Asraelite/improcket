import {canvas, context} from './index.mjs';

export function text(string, x, y,
	{font = '52pt Arial', align = 'left', valign = 'top', color = null}) {
	context.textAlign = align;
	context.textBaseline = valign;
	context.fillStyle = color === null ? context.fillStyle : color;
	context.font = font;

	context.fillText(string, x, y);
}
