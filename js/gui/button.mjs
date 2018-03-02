import * as gui from './index.mjs';

export class GuiButton extends gui.GuiElement {
	constructor(x, y, text, onclick) {
		let textSize = gui.measureText(text, 'Arial 14pt');
		super(x, y, ...textSize);
		this.type = 'button';
	}
}
