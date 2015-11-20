import * as url from "./url";

$(document).ready(function () {

	var showConfigurationView = function () {
		console.log("clicked");
	};


	let urlParser = new url.URLParser(['name', 'stock', 'sayings']);
	var urlParams = urlParser.parseURL(location.search);
	let hasAllParams = urlParser.hasAllParams(location.search);
	console.log(urlParams);
	console.log(hasAllParams);

	if (hasAllParams) {
		// show the page for the specified person
		$.get("templates/views/specific.mustache", function (data) {
			let template = Handlebars.compile(data, {noEscape: true});
			$("#main-container").html(template());

			$.get("templates/statement.mustache", function (data) {
				let template = Handlebars.compile(data, {noEscape: true});
				let context = {question: "How safe is " + urlParams.name + "'s job?", answer: "Hard coded stuff!!!"};
				$("#middle-container").html(template(context));
			});
		});


	} else {
		// show the starting page
		$.get("templates/views/start.mustache", function (data) {
			let template = Handlebars.compile(data, {noEscape: true});
			$("#main-container").html(template());

			$(".configuration-link").on("click", function (event) {
				showConfigurationView();
			})

		});
	}

});


