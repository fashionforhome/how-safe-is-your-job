export class QuandlDriver {

	constructor(apiKey) {
		this.apiKey = apiKey;
	}

	/**
	 * @param options [database, dataset, limit, column, from, to, order, period, transform]
	 * @returns {null}
	 */
	getStockData(options) {
		if (!options['database'] || !options['dataset']) {
			return null;
		}

		var query = this.buildQuery(options);

		console.log("query: " + query);
	}

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