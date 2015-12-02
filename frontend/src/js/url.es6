/**
 * Utility class which lets you extract URL parameters from an URL easily.
 */
export class URLParser {

	/**
	 * @param paramNames array containing the names of the URL parameters
	 */
	constructor(paramNames) {
		this.paramNames = paramNames;
	}

	/**
	 * @returns {{}} An object containing values for all this.paramNames.
	 * If an parameter is absent in the URL, the parameter in the returned object will be null.
	 */
	parseURL(url) {
		let params = {};

		let paramNamesArray = this.getParamNamesArray();

		for (let i = 0; i < paramNamesArray.length; i++) {

			let currentParamName = paramNamesArray[i];

			params[currentParamName] = URLParser.getURLParameter(url, currentParamName);

		}

		return params;
	}

	/**
	 * Checks if the URL has values for all defined URL parameters.
	 */
	hasAllParams(url) {
		let paramNamesArray = this.getParamNamesArray();

		for (let i = 0; i < paramNamesArray.length; i++) {

			if (!URLParser.getURLParameter(url, paramNamesArray[i])) {
				return false;
			}

		}

		return true;
	}

	/**
	 * Returns the parameter names as an array. The returned array will be empty if this.parameterNames is neither an array nor a string.
	 * @returns {*}
	 */
	getParamNamesArray() {
		let paramNamesArray;

		if (Array.isArray(this.paramNames)) {
			paramNamesArray = this.paramNames;
		} else if (typeof  this.paramNames === 'string') {
			paramNamesArray = [this.paramNames];
		} else {
			paramNamesArray = [];
		}
		return paramNamesArray;
	}

	/**
	 * Get value for the given parameter name from the given URL. Returns null if the parameter is not found or has no value.
	 */
	static getURLParameter(url, name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null;
	}

}