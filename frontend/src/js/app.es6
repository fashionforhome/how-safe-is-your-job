import * as url from "./url";

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
				let inputStock = $(event.target).find("#isin").val();
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
		$.get("templates/views/specific.mustache", function (data) {
			let template = Handlebars.compile(data, {noEscape: true});
			$("#main-container").html(template());

			$.get("templates/statement.mustache", function (data) {
				let template = Handlebars.compile(data, {noEscape: true});
				let context = {question: "How safe is " + parameters.name + "'s job?", answer: "Hard coded stuff!!!"};
				$("#middle-container").html(template(context));
			});
		});
	};

	let urlParser = new url.URLParser(['name', 'stock', 'sayings']);
	var urlParams = urlParser.parseURL(location.search);
	let hasAllParams = urlParser.hasAllParams(location.search);
	console.log(urlParams);
	console.log(hasAllParams);

	if (hasAllParams) {
		renderSpecificPage(urlParams);
	} else {
		renderStartingPage();
	}

});


