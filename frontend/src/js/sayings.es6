export class SayingsMapper {

	constructor(sayingsMap) {
		this.sayings = sayingsMap;
	}

	getClosestSaying(value) {

		let minDiff = null;
		let resultKey = null;
		for (let i = 0; i < this.sayings.length; i++) {

			let currDiff = this.sayings[i]['value'] - value;

			currDiff = currDiff > 0 ? currDiff : currDiff * -1;

			if (minDiff === null || currDiff < minDiff) {
				minDiff = currDiff;
				resultKey = i;
			}

		}

		return this.sayings[resultKey]['saying'];
	}
}