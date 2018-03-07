// Connectivity = [top, right, bottom, left] (same TRouBLe as CSS)

export const modules = {
	capsule: {
		small: {
			name: 'Small Capsule',
			tooltip: 'A small, simple capsule. Provides a small amount ' +
				'of rotational power and storage space.',
			type: 'capsule',
			id: 'small',
			mass: 2,
			connectivity: [false, false, true, false],
			capacity: 2,
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
	},
	connector: {
		xheavy: {
			name: 'Heavy 4-way Connector',
			tooltip: 'Can connect ship parts in any direction, but is quite ' +
				'heavy',
			type: 'connector',
			id: 'xheavy',
			mass: 5,
			connectivity: [true, true, true, true]
		}
	}
}
