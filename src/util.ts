export class SeededRandom {
	constructor(seed) {
		this.seed = seed % 2147483647;
	}

	next() {
		 this.seed = this.seed * 16807 % 2147483647;
 		if (this.seed <= 0) this.seed += 2147483646;
		 return (this.seed - 1) / 2147483646;
	}
}
