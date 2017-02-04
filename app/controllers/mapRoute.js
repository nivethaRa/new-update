var args = arguments[0] || {};

var tRoute = require('travelRoute');

var vendorLatitude = args.latitude;
var vendorLongitude = args.longitude;

var i = 0;
var regionLatitude = "";
var regionLongitude = "";
var mapView = null;

function closeWindow() {
	$.getView().close();
}

function showRoute(value) {
	if (value) {
		var mySpecialRoute = Alloy.Globals.Map.createRoute(value);
		if (OS_IOS) {
			$.mapView.addRoute(mySpecialRoute);
		} else if (mapView) {
			mapView.addRoute(mySpecialRoute);
		}

	}
};

function showMapForAndroid() {
	Ti.API.info("*********************showMapForAndroid****************");
	var destinationAnnotation = Alloy.Globals.Map.createAnnotation({
		latitude : vendorLatitude,
		longitude : vendorLongitude,
		pincolor : Alloy.Globals.Map.ANNOTATION_RED,
		myid : 1 // Custom property to uniquely identify this annotation.
	});

	var currentAnnotation = Alloy.Globals.Map.createAnnotation({
		latitude : Alloy.Globals.currentLat,
		longitude : Alloy.Globals.currentLng,
		pincolor : Alloy.Globals.Map.ANNOTATION_RED,
		myid : 2 // Custom property to uniquely identify this annotation.
	});
	regionLatitude = Alloy.Globals.currentLat;
	regionLongitude = Alloy.Globals.currentLng;
	destination = [vendorLatitude, vendorLongitude];

	mapView = Alloy.Globals.Map.createView({
		mapType : Alloy.Globals.Map.NORMAL_TYPE,
		region : {
			latitude : Alloy.Globals.currentLat,
			longitude : Alloy.Globals.currentLng,
			latitudeDelta : 0.02,
			longitudeDelta : 0.02
		},
		animate : true,
		regionFit : true,
		userLocation : true,
		annotations : [currentAnnotation, destinationAnnotation],
		height : Ti.UI.FILL,
		top : 0
	});
	$.mapWindow.add(mapView);

	var source = [Alloy.Globals.currentLat, Alloy.Globals.currentLng];
	var defaultRouteDetails = {
		source : source,
		destination : destination,
		mode : "driving",
		color : 'blue',
	};
	tRoute.iOSRoute(defaultRouteDetails, showRoute);
}

showMapForAndroid();
