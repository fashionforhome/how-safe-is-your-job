/**
 * Created by Daniel Schulz on 16.11.2015.
 */

$(document).ready(function () {

	var func = p => p + 1;

	$("#schwarzer").css("background-color", "black").html("test");

	console.log(func(11));
});