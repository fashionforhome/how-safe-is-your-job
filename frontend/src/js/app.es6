import * as math from "./math";
console.log("2π = " + math.sum(math.pi, math.pi));

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}

console.log('name: ' + getURLParameter('name'));
console.log('stock: ' + getURLParameter('stock'));
console.log('mapping: ' + getURLParameter('mapping'));
