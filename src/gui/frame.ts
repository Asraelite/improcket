import * as gui from './index';
import GuiElement from './element';

export default class GuiFrame extends GuiElement {
	constructor(x, y, w, h, options) {
		super(x, y, w, h, options);
		this.type = 'frame';
	}
}
