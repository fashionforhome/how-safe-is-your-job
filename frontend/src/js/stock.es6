/**
 * Lets you retrieve data from the Quandl API easily.
 */
export class QuandlDriver {

	/**
	 * @param apiKey the key to the Quandl API which will be used for every request
	 */
	constructor(apiKey) {
		this.apiKey = apiKey;
	}

	/**
	 * Get stock data from the Quandl API.
	 *
	 * @see https://www.quandl.com/docs/api?json#datasets for the available parameters
	 *
	 * @param options [database, dataset, column, limit, from, to, order, period, transform] note: strings given must be encoded
	 * @returns {*} the jqXHR object of the request
	 */
	getStockData(options) {
		if (!options['database'] || !options['dataset']) {
			return null;
		}

		let query = this.buildQuery(options);
		console.log("query: " + query);

		return $.getJSON(query);
	}

	/**
	 * Searches for a stock using this Quandl API method:
	 *
	 * https://www.quandl.com/docs/api#dataset-search
	 *
	 * @param query the query string given to the search method of the Quandl API note: must be encoded
	 * @param success a callback which is executed when the API call is successful
	 */
	searchStock(query, success) {
		let url = "https://www.quandl.com/api/v3/datasets.json?auth_token=" + this.apiKey + "&query=" + query;
		return $.getJSON(url, success);
	}


	/**
	 * Calculates the total average for the given column in the given data array
	 */
	static calculateColumnAverage(data, columnIndex) {
		let sum = 0;

		for (let i = 0; i < data.length; i++) {
			sum += data[i][columnIndex];
		}

		let avg = sum / data.length;

		return avg;
	}

	/**
	 * Returns the index of the optimal column. (Prefers the 2nd column)
	 */
	static determineOptimalColumn(data) {
		if (data[0][2]) {
			return 2;
		}
		return 1;

	}

	/**
	 * Build a query for the Quandl API.
	 *
	 * @see https://www.quandl.com/docs/api?json#datasets for the available parameters
	 *
	 * @param options [database, dataset, limit, column, from, to, order, period, transform]
	 * @returns {string} URL to get the stock data with the given options as URL parameters
	 */
	buildQuery(options) {
		var query = "https://www.quandl.com/api/v3/datasets/" + options['database'] + "/" + options['dataset'] + ".json?";

		if (this.apiKey) {
			query += "auth_token=" + this.apiKey + "&";
		}

		if (options['limit']) {
			query += "limit=" + options['limit'] + "&";
		}

		if (options['column']) {
			query += "column_index=" + options['column'] + "&";
		}

		if (options['from']) {
			query += "start_date=" + options['from'] + "&";
		}

		if (options['to']) {
			query += "end_date=" + options['to'] + "&";
		}

		if (options['order']) {
			query += "order=" + options['order'] + "&";
		}

		if (options['period']) {
			query += "collapse=" + options['period'] + "&";
		}

		if (options['transform']) {
			query += "transform=" + options['transform'];
		}

		return query;
	}

}