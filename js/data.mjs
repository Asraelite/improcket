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
			value: 5,
			connectivity: [false, false, true, false],
			capacity: 2,
			rotation: 1
		},
		large: {
			name: 'Large Capsule',
			tooltip: 'A large, bulky capsule. Heavy, but has a lot of ' +
				'rotational power and storage space.',
			type: 'capsule',
			id: 'large',
			mass: 4,
			value: 10,
			connectivity: [false, false, true, false],
			capacity: 5,
			rotation: 4
		},
		advanced: {
			name: 'Advanced Capsule',
			tooltip: 'A futuristic rocket capsule. Has a lot of storage ' +
				'space and rotational power while still being light.',
			type: 'capsule',
			id: 'advanced',
			mass: 2,
			value: 30,
			connectivity: [false, false, true, false],
			capacity: 4,
			rotation: 5
		}
	},
	fuel: {
		small: {
			name: 'Small Fuel Tank',
			tooltip: 'A small flimsy tank with enough fuel for a short trip.',
			type: 'fuel',
			id: 'small',
			mass: 1,
			value: 1,
			connectivity: [true, false, true, false],
			fuelCapacity: 5
		},
		large: {
			name: 'Large Fuel Tank',
			tooltip: 'A large, heavy fuel tank capable of hold a lot of fuel.',
			type: 'fuel',
			id: 'large',
			mass: 2,
			value: 3,
			connectivity: [true, false, true, false],
			fuelCapacity: 15
		},
		advanced: {
			name: 'Advanced Fuel Tank',
			tooltip: 'A very efficient fuel storage tank.',
			type: 'fuel',
			id: 'advanced',
			mass: 1,
			value: 15,
			connectivity: [true, false, true, false],
			fuelCapacity: 12
		}
	},
	thruster: {
		light: {
			name: 'Light Thruster',
			tooltip: 'Powerful enough to lift a small ship, but not much ' +
				'more.',
			type: 'thruster',
			id: 'light',
			mass: 2,
			value: 3,
			connectivity: [true, false, false, false],
			thrust: 10
		},
		heavy: {
			name: 'Heavy Thruster',
			tooltip: 'A powerful thruster for lifting heavy ships.',
			type: 'thruster',
			id: 'heavy',
			mass: 5,
			value: 4,
			connectivity: [true, false, false, false],
			thrust: 40
		},
		advanced: {
			name: 'Advanced Thruster',
			tooltip: 'A very efficient thruster using advanced technology. ',
			type: 'thruster',
			id: 'advanced',
			mass: 2,
			value: 15,
			connectivity: [true, false, false, false],
			thrust: 30
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
			value: 3,
			connectivity: [true, true, true, true]
		},
		advanced: {
			name: 'Advanced 4-way Connector',
			tooltip: 'Connects ship parts while remaining light.',
			type: 'connector',
			id: 'advanced',
			mass: 1,
			value: 15,
			connectivity: [true, true, true, true]
		}
	},
	gyroscope: {
		small: {
			name: 'Small gyroscope',
			tooltip: 'Provides a small amount of rotational power to the ship.',
			type: 'gyroscope',
			id: 'small',
			mass: 3,
			value: 7,
			connectivity: [true, false, true, false],
			rotation: 2
		},
		large: {
			name: 'Large gyroscope',
			tooltip: 'Provides a lot of rotational force for large ships.',
			type: 'gyroscope',
			id: 'large',
			mass: 5,
			value: 15,
			connectivity: [true, false, true, false],
			rotation: 4
		}
	},
	cargo: {
		small: {
			name: 'Cargo bay',
			tooltip: 'A cargo bay for storing modules.',
			type: 'cargo',
			id: 'small',
			mass: 1,
			value: 5,
			connectivity: [true, false, true, false],
			capacity: 5
		}
	}
}
