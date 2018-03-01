

const game = {
	state: {
		room: 'menu',
		paused: false
	}
};

export function init() {
	game.state.room = 'menu';
}

function tick() {
	requestAnimationFrame(tick);
}
