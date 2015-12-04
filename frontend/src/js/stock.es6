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
	 * @param options [database, dataset, column, limit, from, to, order, period, transform]
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
	 * @param query the query string given to the search method of the Quandl API
	 * @param callback a callback which gets the results of the search and filters them
	 */
	searchStock(query, callback) {
		let url = "https://www.quandl.com/api/v3/datasets.json?query=" + query;
		$.when($.getJSON(url)).then(function (data) {
			console.log(data);
		}, function () {
			console.log("could'nt search");
		});
		
		return
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