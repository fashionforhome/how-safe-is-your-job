import * as url from "./url";
import * as stock from "./stock";
import * as sayings from "./sayings";

$(document).ready(function () {

	/**
	 * Renders the starting page.
	 */
	var renderStartingPage = function () {
		$.get("templates/views/start.mustache", function (data) {
			let template = Handlebars.compile(data, {noEscape: true});
			$("#main-container").html(template());

			// show the the configuration form on click
			$(".configuration-link").on("click", function () {
				showConfigurationForm();
			});

			// navigate to the specific page configured by the user on submit
			$("#creation-form").on("submit", function (event) {
				event.preventDefault();

				let inputName = $(event.target).find("#name").val();
				let inputStock = $(event.target).find("#quandl").val();
				let inputSayings = $(event.target).find("#sayings").val();

				// assemble the URL for the specific page
				let searchString = "?name=" + encodeURIComponent(inputName) + "&stock=" + encodeURIComponent(inputStock) + "&sayings=" + encodeURIComponent(inputSayings);

				//navigate to the specific page
				window.location.search = searchString;
			});
		});
	};

	/**
	 * Shows the configuration dialog.
	 */
	var showConfigurationForm = function () {
		// let the title slide to the top and fade in the configuration form afterwards
		$("#title").animate({top: 0}, {
			duration: 1000, easing: "linear", complete: function () {
				$("#creation-form").fadeIn();
			}
		});
	};

	/**
	 * Renders the page for the specified person.
	 */
	var renderSpecificPage = function (parameters) {
		// load the API key and the sayings
		$.when($.getJSON("config.json"), $.getJSON("sample-sayings.json")).done(function (config, sayingsMap) {
			let apiKey = config[0].apiKey;

			// TODO maybe check if the API key is valid

			console.log("API key: ", apiKey);
			console.log("Sayings: ", sayingsMap);

			let quandl = new stock.QuandlDriver(apiKey);

			// one dimensional array containing the database code and the data set code for the Quandl data set
			let quandlCode = parameters.stock.split("/");

			// get the top stock price for each date ordered ascending from the data set 
			let quandlParams = {database: quandlCode[0], dataset: quandlCode[1], column: 2, order: 'asc'};

			// load the stock data and then render specific page if the load was successful otherwise load the starting page
			$.when(quandl.getStockData(quandlParams)).then(function (stockData) {
				console.log("Quandl JSON: ", stockData);

				// calculate the total average price
				var average = stock.QuandlDriver.calculateColumnAverage(stockData['dataset']['data'], 1);

				// get the most recent stock price
				var currentStockPrice = stockData['dataset']['data'][stockData['dataset']['data'].length - 1][1];

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

						// navigate to the starting page on click
						$(".config-btn").on("click", function () {
							window.location.search = "";
						});

						// render the stock chart initially and on every resize
						drawChart(stockData['dataset']['data']);
						$(window).on("resize", function () {
							drawChart(stockData['dataset']['data']);
						});

						// render stock description with heading
						$(".stock-name").html(stockData['dataset']['name']);
						$(".stock-description").html(stockData['dataset']['description']);
					});
				});
			}, renderStartingPage);
		});
	};

	/**
	 * Draws a line chart using the Google Charts API.
	 * @param data data the chart should visualize
	 */
	var drawChart = function drawChart(data) {

		// add a head to the data
		let tableArray = [['Time', 'Stock Price']];
		tableArray = tableArray.concat(data);

		let table = google.visualization.arrayToDataTable(tableArray);

		let options = {
			//title: 'Stock Price',
			//titleTextStyle: {fontSize: "25", bold: false},
			curveType: 'function',
			legend: {position: 'none'},
			backgroundColor: 'whitesmoke',
			colors: ['#3366CC'],
			chartArea:{top: 10}
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


