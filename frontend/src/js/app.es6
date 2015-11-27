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

			$(".configuration-link").on("click", function (event) {
				showConfigurationForm();
			});

			$("#creation-form").on("submit", function (event) {
				event.preventDefault();
				console.log("submitted creation form");

				let inputName = $(event.target).find("#name").val();
				let inputStock = $(event.target).find("#quandl").val();
				let inputSayings = $(event.target).find("#sayings").val();
				let inputParams = {name: inputName, sayings: inputSayings, stock: inputStock};

				console.log(inputParams);

				let searchString = "?name=" + encodeURIComponent(inputName) + "&stock=" + encodeURIComponent(inputStock) + "&sayings=" + encodeURIComponent(inputSayings);

				console.log(searchString);

				window.location.search = searchString;
			});
		});
	};

	/**
	 * Shows the configuration dialog.
	 */
	var showConfigurationForm = function () {
		console.log("clicked");

		$("#title").animate({top: 0}, {
			duration: 1000, easing: "linear", complete: function () {
				$("#creation-form").fadeIn();
			}
		});
	};

	/**
	 * Render the page for the specified person.
	 */
	var renderSpecificPage = function (parameters) {
		$.when($.getJSON("config.json"), $.getJSON("sample-sayings.json")).done(function (config, sayingsMap) {
			let apiKey = config[0].apiKey;
			// TODO maybe check if the API key is valid

			console.log(apiKey);
			let quandl = new stock.QuandlDriver(apiKey);

			let quandlCode = parameters.stock.split("/");

			let quandlParams = {database: quandlCode[0], dataset: quandlCode[1], column: 1};

			$.when(quandl.getStockData(quandlParams)).then(function (stockData) {

				console.log("stockData ", stockData);

				var average = quandl.calculateColumnAverage(stockData['dataset']['data']);

				var currentStockPrice = stockData['dataset']['data'][0][1];

				var currentPercentageStockStatus = currentStockPrice / average * 100;

				console.log("currentStockPrice ", currentStockPrice);

				console.log("average ", average);

				console.log("currentPercentageStockStatus ", currentPercentageStockStatus);

				let sayingsMapper = new sayings.SayingsMapper(sayingsMap[0]);

				var saying = sayingsMapper.getClosestSaying(currentPercentageStockStatus);

				$.get("templates/views/specific.mustache", function (data) {
					let template = Handlebars.compile(data, {noEscape: true});
					$("#main-container").html(template());


					// Set a callback to run when the Google Visualization API is loaded.
					drawChart();

					$.get("templates/statement.mustache", function (data) {
						let template = Handlebars.compile(data, {noEscape: true});
						let context = {
							question: "How safe is " + parameters.name + "'s job?",
							answer: saying
						};
						$("#middle-container").html(template(context));
					});
				});
			}, renderStartingPage);
		});
	};

	// Callback that creates and populates a data table,
	// instantiates the pie chart, passes in the data and
	// draws it.
	var drawChart = function drawChart() {

		console.log("drawing chart");

		// Create the data table.
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Topping');
		data.addColumn('number', 'Slices');
		data.addRows([
			['Mushrooms', 3],
			['Onions', 1],
			['Olives', 1],
			['Zucchini', 1],
			['Pepperoni', 2]
		]);

		// Set chart options
		//var options = {
		//	'title': 'How Much Pizza I Ate Last Night',
		//	'width': 400,
		//	'height': 300
		//};

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
		chart.draw(data,{});
	};

	// Load the Visualization API and the piechart package.
	//google.load('visualization', '1.0', {'packages':['corechart']});

	let urlParser = new url.URLParser(['name', 'stock', 'sayings']);
	var urlParams = urlParser.parseURL(location.search);
	let hasAllParams = urlParser.hasAllParams(location.search);
	console.log("param names: " + urlParser.paramNames);
	console.log(urlParams);
	console.log(hasAllParams);

	if (hasAllParams) {
		renderSpecificPage(urlParams);
	} else {
		renderStartingPage();
	}

});


