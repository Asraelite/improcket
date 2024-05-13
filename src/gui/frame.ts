import * as gui from './index';
import GuiElement from './element';

export default class GuiFrame extends GuiElement {
	constructor(x, y, width, height, options) {
		super(x, y, width, height, options);
		this.type = 'frame';
	}
}
