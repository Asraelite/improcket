export const modules = {
	capsule: {
		small: {
			name: 'Small Capsule',
			tooltip: 'A small, simple capsule. Provides just enough ' +
				'rotational power for a small rocket.',
			type: 'capsule',
			mass: 2,
			rotation: 0.1
		}
	},
	fuel: {
		small: {
			name: 'Small Fuel Tank',
			tooltip: 'A small flimsy tank with enough fuel for a short trip.',
			type: 'fuel',
			mass: 1,
			capacity: 3
		}
	},
	thruster: {
		light: {
			name: 'Light Main Thruster',
			tooltip: 'Powerful enough to lift a small ship, but not much ' +
				'more. Not very efficient.',
			type: 'thruster',
			mass: 2,
			thrust: 10,
			isp: 200
		}
	}
}
