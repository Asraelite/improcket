export const images = {
	title: {
		logo: 'logo.png'
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
