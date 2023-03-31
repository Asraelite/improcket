import * as gui from './index.mjs';
import GuiElement from './element.mjs';
import {context} from '../graphics/index.mjs';

export default class GuiText extends GuiElement {
	constructor(text = '', x, y, w, h, {
		size = 10,
		align = 'left',
		valign = 'top',
		color = '#fff'
	} = {}) {
		w = w;
		h = h;
		super(x, y, w, h);
		this.type = 'text';
		this.color = color;
		this.text = text;
		this.spacing = size * 1.2;
		this.font = size + 'px Courier New';
		this.align = align;
		this.valign = valign;
	}

	splitLines() {
		// Not very robust, but good enough for now. Mebe fix later?
		context.font = this.font;
		let maxLineLength = (this.w / context.measureText('A').width) | 0;
		maxLineLength = Math.max(maxLineLength, 1);

		let lines = [];
		let currentLine = '';

		this.text.split('\n').forEach(l => {
			currentLine = '';
			l.split(' ').forEach(word => {
				if (word.length + currentLine.length > maxLineLength) {
					lines.push(currentLine.slice(0, -1));
					currentLine = '';
				}
				currentLine += word + ' ';
			});
			lines.push(currentLine.slice(0, -1));
		});

		this.text = lines.join('\n');
	}
}
