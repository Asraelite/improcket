export const images = {
	title: {
		logo: 'logo.png',
		logoSvg: 'logo2.svg'
	},
	background: {
		back: 'background.png',
		middle: 'stars_back.png',
		front: 'stars_front.png'
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
		},
		connector: {
			xheavy: 'modules/xheavy_connector.svg'
		},
		fuelcan: 'modules/fuelcan.svg'
	},
	celestials: {
		green: {
			'0': 'celestials/green_0.svg',
			'1': 'celestials/green_1.svg'
		}
	}
};

export const audio = {
	itemPickup: 'up1.mp3',
	fuelPickup: 'blip2.mp3',
	endEdit: 'release1.mp3',
	newPlanet: 'up2.mp3',
	engine: 'rocket2.ogg',
	music: 'music2.mp3',
	toss: 'thunk1.mp3',
	crash: 'crash2.mp3',
	pause: 'swoosh1.mp3'
};

export async function init() {
	let parse = (obj, convert) => Object.entries(obj).forEach(([k, v]) => {
		typeof v == 'object' ? parse(v, convert) : obj[k] = convert(v);
	});

	let promises = [];
	parse(images, str => {
		let img = new Image();
		img.src = 'img/' + str;
		promises.push(new Promise((res) => {
			img.addEventListener('load', res);
		}));
		return img;
	});
	parse(audio, str => {
		let audio = new Howl({
			src: ['audio/' + str]
		});
		promises.push(new Promise((res) => {
			audio.once('load', res);
		}));
		return audio;
	});

	await Promise.all(promises);
}
