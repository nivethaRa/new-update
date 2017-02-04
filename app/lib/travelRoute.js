exports.iOSRoute = function(params, complete) {
	function decodeLine(encoded) {
		var len = encoded.length;
		var index = 0;
		var array = [];
		var lat = 0;
		var lng = 0;

		while (index < len) {
			var b;
			var shift = 0;
			var result = 0;
			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lat += dlat;

			shift = 0;
			result = 0;
			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lng += dlng;

			array.push([lat * 1e-5, lng * 1e-5]);
		}
		return array;
	}

	var url = "http://maps.googleapis.com/maps/api/directions/json?origin=" + params.source + "&destination=" + params.destination + "&sensor=false&mode=" + params.mode;
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open('GET', url);
	xhr.onload = function() {
		Ti.API.info("json.routes[0].legs[0].steps " + this.responseText);

		var json = JSON.parse(this.responseText);
		if (json.routes[0]) {
			var step = json.routes[0].legs[0].steps;
			var points = [];
			for (var i = 0; i < step.length; i++) {
				var decode = decodeLine(step[i].polyline.points);
				for (var cc = 0; cc < decode.length; cc++) {
					if (decode[cc] != null) {
						points.push({
							latitude : decode[cc][0],
							longitude : decode[cc][1]
						});
					}
				};
			};

			var route = {
				name : 'mapRoute',
				points : points,
				color : params.color,
				width : 4,
			};
			complete(route);
		} else {
			complete(null);
		}
	};
	xhr.send();
};

exports.androidRoute = function(params, complete) {
	var gd = require('de.codewire.google.directions');
	gd.getRoute({
		origin : params.source,
		destination : params.destination,
		color : params.color,
		mode : params.mode,
		width : 4,
		name : 'single',
		callback : function(response) {
			if (response.status == 'OK') {
				complete(response.route);
			} else {
				alert(response.msg);
			}
		}
	});
};

