var serviceUtility = require('ServiceUtility'),
    SFEZKeys = require("SFEZKeys"),
    utils = require("utils");
var userInfo = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO);
$.vendorName.text = (userInfo && userInfo.company) ? userInfo.company.name : "Paco's Tacos";

function FPScrollClicked(e) {
	$.FPScroll.height = 0;
	Ti.API.info('dss ' + JSON.stringify(e));
}

function getFoodParkPickerRowData(pickerData) {
	var rows = [];
	rows[0] = Ti.UI.createPickerRow({
		title : "Select Food Park",
	});
	var j = 1;
	for (var i = 0; i < pickerData.length; i++) {
		rows[j] = Ti.UI.createPickerRow({
			title : pickerData[i].name,
		});

		j++;
	}
	return rows;
}

var foodParkPicker = Ti.UI.createPicker({
	top : 0,
	selectionIndicator : true,
	height : Titanium.UI.FILL,
	width : Titanium.UI.FILL
});
Alloy.Globals.foodParks && foodParkPicker.add(getFoodParkPickerRowData(Alloy.Globals.foodParks));

$.pickerView.add(foodParkPicker);
foodParkPicker.setSelectedRow(0, 0, false);

foodParkPicker.addEventListener('change', function(e) {
	var index = e.rowIndex;
	if (foodParkPicker.getSelectedRow(0).getTitle() && foodParkPicker.getSelectedRow(0).getTitle() != "Select Food Park") {
		_.delay(function() {
			utils.replaceCentralView({
				view : Alloy.createController('/foodtruck/checkins/checkin_second', Alloy.Globals.foodParks[index - 1]).getView(),
				title : "Check In"
			});
		}, 500);
	}
});

function getFoodParksData() {
	Alloy.Globals.Services.Vendor.GetFoodParks(function(response) {
		Ti.API.info("*******getFoodParksData************* " + JSON.stringify(response));
		Alloy.Globals.foodParks = response;
		foodParkPicker.add(getFoodParkPickerRowData(Alloy.Globals.foodParks));
	});
}

getFoodParksData();

function UpdateCheckBox(e) {
	if (!e.source.idCheck) {
		e.source.idCheck = true;
		e.source.image = "/images/check_on.png";
		isVendor = true;
	} else {
		e.source.idCheck = false;
		e.source.image = "/images/check_off.png";
		isVendor = false;
	}
}
