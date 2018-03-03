export const images = {
	title: {
		logo: 'logo.png',
		logoSvg: 'logo2.svg'
	},
	modules: {
		capsule: {
			small: 'modules/small_capsule.svg'
		},
		fuel: {
			small: 'modules/small_fuel_tank.svg'
		},
		thruster: {
			light: {
				off: 'modules/light_thruster.svg',
				on: 'modules/light_thruster_on.svg',
			}
		}
	},
	celestials: {
		green: {
			"0": 'celestials/green_0.svg'
		}
	}
};

export const audio = {};

export async function init() {
	let parse = (obj, convert) => Object.entries(obj).forEach(([k, v]) => {
		typeof v == 'object' ? parse(v, convert) : obj[k] = convert(v);
	});

	let promises = [];
	parse(images, str => {
		let img = new Image();
		img.src = 'img/' + str;
		promises.push(new Promise((res, rej) => {
			img.addEventListener('load', res);
		}));
		return img;
	});
	parse(audio, str => {
		// TODO: Load audio.
	});

	await Promise.all(promises);
}
