import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/main.ts',
	output: {
		file: 'dist/improcket.min.js',
		format: 'iife',
		sourcemap: true
	},
	plugins: [
		typescript(),
	]
};
