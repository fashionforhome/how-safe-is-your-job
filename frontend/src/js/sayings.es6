/**
 * Maps sayings by values.
 */
export class SayingsMapper {

	/**
	 * @param sayingsMap the map of sayings as object in the form of: {value : saying}
	 */
	constructor(sayingsMap) {
		this.sayings = sayingsMap;
	}

	/**
	 * Returns the saying which's value is the closest to the given value.
	 */
	getClosestSaying(value) {
		let minDiff = null;
		let resultKey = null;
		for (let currVal in this.sayings) {
			if (this.sayings.hasOwnProperty(currVal)) {
				let currDiff = parseFloat(currVal) - value;

				currDiff = currDiff > 0 ? currDiff : currDiff * -1;

				if (minDiff === null || currDiff < minDiff) {
					minDiff = currDiff;
					resultKey = currVal;
				}
			}
		}

		return this.sayings[resultKey];
	}
}