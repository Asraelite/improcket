import {canvas, context} from './index.mjs';

export function text(string, x, y,
	{font = '52pt Arial', align = 'left', valign = 'top'}) {
	context.textAlign = align;
	context.textBaseline = valign;
	context.font = font;
	
	context.fillText(string, x, y);
}
