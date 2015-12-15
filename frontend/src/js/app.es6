import * as url from "./url";
import * as stock from "./stock";
import * as sayings from "./sayings";

$(document).ready(function () {

	/**
	 * Renders the starting page.
	 */
	var renderStartingPage = function () {
		$.when($.getJSON("config.json"), $.get("templates/views/start.mustache"), $.get("templates/creation-form.mustache"), $.getJSON("sayings/index.json")).then(function (config, startViewData, creationFormData, sayingsData) {
			let apiKey = config[0].apiKey;

			console.log("API key: ", apiKey);

			let quandl = new stock.QuandlDriver(apiKey);

			// render the starting page
			let startViewTemplate = Handlebars.compile(startViewData[0], {noEscape: true});
			$("#main-container").html(startViewTemplate());


			let sayingsHtml = "";

			for (let sayingsID in sayingsData[0]) {
				if (sayingsData[0].hasOwnProperty(sayingsID)) {
					let sayingsName = sayingsData[0][sayingsID];

					sayingsHtml += '<option value="' + sayingsID + '">' + sayingsName + '</option>';
				}
			}

			let context = {sayings: sayingsHtml.toString()};

			// render the creation form
			let creationFormTemplate = Handlebars.compile(creationFormData[0], {noEscape: true});
			$("#creation-form-container").html(creationFormTemplate(context));

			$('[data-toggle="tooltip"]').tooltip();

			// show the configuration form on the first click in an animated way and on the second click instantly
			let clicks = 0;
			$(".configuration-link").on("click", function (event) {
				event.preventDefault();
				clicks++;
				if (clicks === 1) {
					showConfigurationFormAnimated();
				} else if (clicks === 2) {
					showConfigurationFormInstantly();
				}
			});

			// contains the jqXHR objects for all search requests
			var searchRequests = [];

			//contains the timeout of the last search request
			var searchTimeout;
			$("#quandl").on("input", function (event) {

				$(".quandl-info-btn").removeClass("rotate");

				//cancel all search requests
				for (let i = 0; i < searchRequests.length; i++) {
					searchRequests[i].abort();
					searchRequests.splice(i, 1);
				}

				// cancel the last request
				if (searchTimeout) {
					clearTimeout(searchTimeout);
				}

				// empty searches are not permitted
				if ($(event.target).val() !== "") {

					// send the search request 1 second later to the Quandl API
					searchTimeout = setTimeout(function () {

						$(".quandl-info-btn").addClass("rotate");

						let searchRequest = quandl.searchStock(encodeURIComponent($(event.target).val()));
						searchRequests.push(searchRequest);

						$.when(searchRequest).then(function (data) {
							let searchResult = [];
							for (let i = 0; i < data["datasets"].length; i++) {

								let currElem = data["datasets"][i];

								// only add if the Quandl data set is for free
								if (currElem["premium"] === false) {
									searchResult.push({
										name: currElem["name"],
										quandlCode: currElem["database_code"] + "/" + currElem["dataset_code"],
										desc: currElem["description"]
									});
								}
							}

							let stocksElement = $("#stocks").removeAttr("disabled").html("");

							let stocksHtml = "";

							for (let i = 0; i < searchResult.length; i++) {
								let currElem = searchResult[i];
								stocksHtml += '<option value="' + currElem["quandlCode"] + '">' + currElem["name"] + '</option>';
							}

							stocksElement.html(stocksHtml);

							$(".quandl-info-btn").removeClass("rotate");
						});
					}, 1000);
				}
			});

			// navigate to the specific page configured by the user on submit
			$("#creation-form").on("submit", function (event) {
				event.preventDefault();

				let inputName = $(event.target).find("#name").val();
				let inputStock = $(event.target).find("#stocks").val();
				let inputSayings = $(event.target).find("#sayings").val();

				// assemble the URL for the specific page
				let searchString = "?name=" + encodeURIComponent(inputName) + "&stock=" + encodeURIComponent(inputStock) + "&sayings=" + encodeURIComponent(inputSayings);

				//navigate to the specific page
				window.location.search = searchString;
			});
		});
	};

	/**
	 * Shows the configuration dialog in an animated way.
	 */
	var showConfigurationFormAnimated = function () {
		// let the title slide to the top and fade in the configuration form afterwards
		$("#title").animate({top: 0}, {
			duration: 1000, easing: "linear", complete: function () {
				$("#creation-form").fadeIn();
			}
		});
	};

	/**
	 * Shows the configuration dialog instantly.
	 */
	var showConfigurationFormInstantly = function () {
		$("#title").finish().css({top: 0});
		$("#creation-form").finish().css({display: "initial"});
	};

	/**
	 * Renders the page for the specified person.
	 */
	var renderSpecificPage = function (parameters) {

		// path to the respective saying
		let sayingsPath = "sayings/" + parameters.sayings + ".json";

		// load the API key and the sayings
		$.when($.getJSON("config.json"), $.getJSON(sayingsPath)).then(function (config, sayingsMap) {
			let apiKey = config[0].apiKey;

			// TODO maybe check if the API key is valid

			console.log("API key: ", apiKey);
			console.log("Sayings: ", sayingsMap);

			let quandl = new stock.QuandlDriver(apiKey);

			// one dimensional array containing the database code and the data set code for the Quandl data set
			let quandlCode = parameters.stock.split("/");

			// get the top stock price for each date ordered ascending from the data set
			let quandlParams = {database: quandlCode[0], dataset: quandlCode[1], order: 'asc'};

			// load the stock data and then render specific page if the load was successful otherwise load the starting page
			$.when(quandl.getStockData(quandlParams)).then(function (stockData) {
				console.log("Quandl JSON: ", stockData);

				// determine the optimal column
				var optimalColumn = stock.QuandlDriver.determineOptimalColumn(stockData['dataset']['data']);

				// calculate the total average price
				var average = stock.QuandlDriver.calculateColumnAverage(stockData['dataset']['data'], optimalColumn);

				// get the most recent stock price
				var currentStockPrice = stockData['dataset']['data'][stockData['dataset']['data'].length - 1][optimalColumn];

				// calculate the percentage ratio of the total average price to the current price
				var currentPercentageStockStatus = currentStockPrice / average * 100;

				console.log("Current stock price: ", currentStockPrice);

				console.log("Total average stock price: ", average);

				console.log("Current stock performance: ", currentPercentageStockStatus);

				let sayingsMapper = new sayings.SayingsMapper(sayingsMap[0]);

				var saying = sayingsMapper.getClosestSaying(currentPercentageStockStatus);

				// render the specific page
				$.get("templates/views/specific.mustache", function (data) {
					let template = Handlebars.compile(data, {noEscape: true});
					$("#main-container").html(template());

					$.when($.get("templates/statement.mustache"), $.get("templates/config-button.mustache")).then(function (statement, configButton) {

						// render the statement
						let statementTemplate = Handlebars.compile(statement[0], {noEscape: true});
						let context = {
							question: "How safe is " + parameters.name + "'s job?",
							answer: saying
						};

						$(".statement-container").html(statementTemplate(context));

						// render the config button
						let configButtonTemplate = Handlebars.compile(configButton[0], {noEscape: true});
						$("#toolbar").html(configButtonTemplate());

						// render the stock chart initially and on every resize
						drawChart(stockData['dataset']['data'], optimalColumn);
						$(window).on("resize", function () {
							drawChart(stockData['dataset']['data'], optimalColumn);
						});

						// render stock description with heading
						$(".stock-name").html(stockData['dataset']['name']);
						$(".stock-description").html(stockData['dataset']['description']);
					});
				});
			}, renderStartingPage);
		}, renderStartingPage);
	};

	/**
	 * Draws a line chart using the Google Charts API.
	 * @param data data the chart should visualize
	 */
	var drawChart = function drawChart(data, columnIndex) {

		// add a head to the data
		let tableArray = [['Time', 'Stock Price']];
		tableArray = tableArray.concat(data.map(function (value, index) {
			return [value[0], value[columnIndex]];
		}));

		let table = google.visualization.arrayToDataTable(tableArray);

		let options = {
			//title: 'Stock Price',
			//titleTextStyle: {fontSize: "25", bold: false},
			curveType: 'function',
			legend: {position: 'none'},
			backgroundColor: 'whitesmoke',
			colors: ['#3366CC'],
			chartArea: {top: 10}
		};

		let chart = new google.visualization.LineChart(document.getElementById('chart_div'));

		chart.draw(table, options);

		//remove unnecessary divs from body element
		$("body>div:not(:first)").remove();
	};

	let urlParser = new url.URLParser(['name', 'stock', 'sayings']);

	// get the desired URL parameters from the URL
	let urlParams = urlParser.parseURL(location.search);

	// check if the URL has all desired parameters
	let hasAllParams = urlParser.hasAllParams(location.search);

	// render the specific page if the URL has all desired parameters otherwise render the starting page
	if (hasAllParams) {
		renderSpecificPage(urlParams);
	} else {
		renderStartingPage();
	}

});