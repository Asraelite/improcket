import * as input from '../input';

export class Rect {
	sourceWidth: number | (() => number);
	sourceHeight: number | (() => number);
	sourceX: number | (() => number);
	sourceY: number | (() => number);

	constructor(x = 0, y = 0, width = 0, height = 0) {
		this.x = x;
		this.y = y;
		this.sourceWidth = width;
		this.sourceHeight = height;

		this.onclick = null;
		this.mouseHeld = false;

		this.rightMouseHeld = false;
		this.onRightClick = null;
	}

	click() {}

	rightClick() {}

	tickMouse() {
		if (this.mouseHeld == true && !input.mouse.held[0] && this.mouseOver)
			this.click();
		if (!this.mouseHeld && input.mouse.pressed[0] && this.mouseOver)
			this.mouseHeld = true;
		if (!input.mouse.held[0])
			this.mouseHeld = false;

		if (this.rightMouseHeld == true && !input.mouse.held[2]
			&&this.mouseOver)
			this.rightClick();
		if (!this.rightMouseHeld && input.mouse.pressed[2] && this.mouseOver)
			this.rightMouseHeld = true;
		if (!input.mouse.held[2])
			this.rightMouseHeld = false;
	}

	get shape() {
		return [this.x, this.y, this.w, this.h];
	}

	get end() {
		return [this.x + this.w, this.y + this.h];
	}

	get center() {
		return [this.x + this.w / 2, this.y + this.h / 2];
	}

	get mouseOver() {
		return this.containsPoint(input.mouse.x, input.mouse.y);
	}

	get mouseClicked() {
		return this.mouseOver() && input.mouse.pressed[0];
	}

	get w() {
		if (typeof this.sourceWidth == 'function') {
			return this.sourceWidth();
		} else {
			return this.sourceWidth;
		}
	}

	get h() {
		if (typeof this.sourceHeight == 'function') {
			return this.sourceHeight();
		} else {
			return this.sourceHeight;
		}
	}
	
	set w(w) {
		this.sourceWidth = w;
	}

	set h(h) {
		this.sourceHeight = h;
	}

	get x() {
		if (typeof this.sourceX == 'function') {
			return this.sourceX();
		} else {
			return this.sourceX;
		}
	}

	get y() {
		if (typeof this.sourceY == 'function') {
			return this.sourceY();
		} else {
			return this.sourceY;
		}
	}
	
	set x(x) {
		this.sourceX = x;
	}

	set y(y) {
		this.sourceY = y;
	}

	containsPoint(x, y) {
		return x > this.x && x < this.x + this.w
			&& y > this.y && y < this.y + this.h;
	}
}
