export class SayingsMapper {

	constructor(sayingsMap) {
		this.sayings = sayingsMap;
	}

	getClosestSaying(value) {

		let minDiff = null;
		let resultKey = null;
		for (let currVal in this.sayings) {

			let currDiff = parseFloat(currVal) - value;

			currDiff = currDiff > 0 ? currDiff : currDiff * -1;

			if (minDiff === null || currDiff < minDiff) {
				minDiff = currDiff;
				resultKey = currVal;
			}

		}

		return this.sayings[resultKey];
	}
}