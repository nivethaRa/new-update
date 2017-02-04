var args = arguments[0] || {};
Ti.API.info("****************args************* " + JSON.stringify(args));
var moment = require('alloy/moment'),
    SFEZKeys = require("SFEZKeys"),
    utils = require("utils");
var userInfo = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO);
var currentTime = moment();
var closingTime = "";
Ti.API.info("**************food park name*********** " + args.name);
$.foodParkName.text = "Food Park: " + args.name;
$.currentTime.text = currentTime.format("h:mm a");
var pinViews = [];

var mapview = Alloy.Globals.Map.createView({
	userLocation : true,
	mapType : Alloy.Globals.Map.NORMAL_TYPE,
	animate : true,
	regionFit : true,
	region : {
		latitude : args.latitude,
		longitude : args.longitude,
		latitudeDelta : 0.02,
		longitudeDelta : 0.02
	},
	top : 0,
	animate : true,
	zIndex : 1,
	left : 0
});
$.mapV.add(mapview);

//CREATE MAP PIN
var pinView = Alloy.Globals.Map.createAnnotation({
	latitude : args.latitude,
	longitude : args.longitude,
	title : args.name,
	pincolor : Alloy.Globals.Map.ANNOTATION_RED,
});
pinViews.push(pinView);
mapview.annotations = pinViews;

function isClosingTimeLess(a, b) {
	if (a > b) {
		return true;
	} else {
		return false;
	}
}

function saveClicked() {
	var isValid = true;
	if (!closingTime) {
		isValid = false;
	} else {
		isValid = isClosingTimeLess(closingTime, currentTime);
	}
	if (!isValid) {
		Alloy.Globals.simpleAlert("Closing time must be greater than current time");
		return;
	}
	Alloy.Globals.loading.show("Please wait...", false);
	var params = {
		"check_in" : currentTime.toISOString(),
		"check_out" : closingTime.toISOString(),
		"latitude" : "-5.784104",
		"longitude" : "-35.189276",
		"unit_id" : userInfo.unit,
		"company_id" : userInfo.company,
		"food_park_id" : args.id,
		"food_park_name" : args.name
	};
	Alloy.Globals.Services.Vendor.checkIn(params, function(response) {
		Alloy.Globals.loading.hide();
		userInfo['checkIn'] = response;
		Alloy.Globals.setData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO, userInfo);
		utils.replaceCentralView({
			view : Alloy.createController('/foodtruck/checkins/checkin_third').getView(),
			title : "Check In"
		});
	});
}

$.picker.addEventListener("change", function(e) {
	closingTime = moment(e.value);
});
