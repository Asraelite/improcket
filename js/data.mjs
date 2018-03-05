// Connectivity = [top, right, bottom, left] (same TRouBLe as CSS)

export const modules = {
	capsule: {
		small: {
			name: 'Small Capsule',
			tooltip: 'A small, simple capsule. Provides just enough ' +
				'rotational power for a small rocket.',
			type: 'capsule',
			id: 'small',
			mass: 2,
			connectivity: [false, false, true, false],
			capacity: 3,
			rotation: 0.1
		}
	},
	fuel: {
		small: {
			name: 'Small Fuel Tank',
			tooltip: 'A small flimsy tank with enough fuel for a short trip.',
			type: 'fuel',
			id: 'small',
			mass: 1,
			connectivity: [true, false, true, false],
			fuelCapacity: 5
		}
	},
	thruster: {
		light: {
			name: 'Light Main Thruster',
			tooltip: 'Powerful enough to lift a small ship, but not much ' +
				'more. Not very efficient.',
			type: 'thruster',
			id: 'light',
			mass: 2,
			connectivity: [true, false, false, false],
			thrust: 10,
			isp: 200
		}
	}
}
