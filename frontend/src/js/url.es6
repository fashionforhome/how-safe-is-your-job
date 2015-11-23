export class URLParser {

	constructor(paramNames) {
		this.paramNames = paramNames;
	}

	parseURL(url) {
		let params = {};

		let paramNamesArray = this.getParamNamesArray();

		for (let i = 0; i < paramNamesArray.length; i++) {

			let currentParamName = paramNamesArray[i];

			params[currentParamName] = URLParser.getURLParameter(url, currentParamName);

		}

		return params;
	}

	hasAllParams(url) {
		let paramNamesArray = this.getParamNamesArray();

		for (let i = 0; i < paramNamesArray.length; i++) {

			if (!URLParser.getURLParameter(url, paramNamesArray[i])) {
				return false;
			}

		}

		return true;
	}

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

	static getURLParameter(url, name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null;
	}

}