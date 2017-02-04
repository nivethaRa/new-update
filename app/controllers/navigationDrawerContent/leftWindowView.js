var args = arguments[0] || {};
var utils = require("utils"),
    previousRowClicked = null,
    currentRowClicked = null,
    _notify_keys = require("_notify_Keys");
var moment = require('alloy/moment');
Alloy.Globals.table = $.leftMenuTableView;

var tableData = [{
	rowTitle : L("insurance"),
	icons : "/images/leftmenuicon/insurances.png"
}, {
	rowTitle : L("bill"),
	icons : "/images/leftmenuicon/bills.png"
}, {
	rowTitle : L("medicalrecord"),
	icons : "/images/leftmenuicon/medicalrecords.png"
}, {
	rowTitle : L("document"),
	icons : "/images/leftmenuicon/documents.png"
}, {
	rowTitle : L("investment"),
	icons : "/images/leftmenuicon/investments.png"
}, {
	rowTitle : L("hospitallocator"),
	icons : "/images/leftmenuicon/hospitalLocator.png"
}, {
	rowTitle : L("settings"),
	icons : "/images/leftmenuicon/settings.png"
}];

Array.prototype.insert = function(index, item) {
	this.splice(index, 0, item);
};

if (Alloy.Globals.getData(_notify_keys.KEYS.PARTNER_EXIST)) {
	tableData.insert(0, {
		rowTitle : L("partnership"),
		icons : "/images/leftmenuicon/partnership.png"
	});
}

for ( i = 0; i < tableData.length; i++) {
	var row = Alloy.createController('notifySliderContent/leftMenuTableViewRow', tableData[i]).getView();
	if (i == tableData.length - 1) {
		row.separator.show();
	}
	$.leftMenuTableView.appendRow(row);
}

if (Alloy.Globals.getData(_notify_keys.KEYS.CHECK_IN_TAB_ADDED)) {
	require("services/checkInService").addCheckInTab();
}

//Bydefault first row is clicked i.e. row backgroundcolor is grey

currentRowClicked = 0;
$.firstRow.personName = $.personName;
$.firstRow.personEmailID = $.personEmailID;

Alloy.Globals.changeRowBackgroundColor = function(_currentIndex) {
	Ti.API.info(" _currentIndex " + _currentIndex);
	switch(_currentIndex) {
	case 0 :
		var registrationData = Alloy.Globals.getData(_notify_keys.KEYS.REGISTER_DATA);
		if (registrationData) {
			//_.delay(function() {
			$.leftMenuTableView.data[0].rows[0].personName.text = registrationData.name;
			$.leftMenuTableView.data[0].rows[0].personEmailID.text = registrationData.email;
			//$.leftMenuTableView.data[0].rows[0].backgroundColor = "#BDBDBD";
			//}, 300);

			$.leftMenuTableView.updateRow(0, $.leftMenuTableView.data[0].rows[0]);

		}
	case 1 :
	case 2 :
	case 3 :
	case 4 :
	case 5 :
	case 6 :
	case 7 :
		previousRowClicked = currentRowClicked;
		currentRowClicked = _currentIndex;
		//Ti.API.info("  previousRowClicked  " + previousRowClicked + "\n  currentRowClicked  " + currentRowClicked);
		$.leftMenuTableView.data[0].rows[previousRowClicked].backgroundColor = "#FFFFFF";
		$.leftMenuTableView.data[0].rows[currentRowClicked].backgroundColor = "#BDBDBD";
		break;
	default:
		//Ti.API.info("  previousRowClicked...  " + previousRowClicked + "\n  currentRowClicked.....  " + currentRowClicked);
		$.leftMenuTableView.data[0].rows[currentRowClicked].backgroundColor = "#FFFFFF";
		break;
	}
};
Alloy.Globals.changeRowBackgroundColor(0);

function leftTableClick(e) {
	Ti.API.info("********leftTableClick************** " + e.row.rowTitle);
	//require("spinner").show();
	Alloy.Globals.slider && Alloy.Globals.slider.toggleLeftWindow();
	//means we are not on the login screens
	Alloy.Globals.loginScreenIsOpen = null;
	if (!Alloy.Globals.getData(_notify_keys.KEYS.LOGINSTATUS)) {
		return;
	}
	Alloy.Globals.changeRowBackgroundColor(e.index);
	var index = e.index;
	var rightActionImage = "/images/help.png";
	var view = null;
	var title = null;
	switch(e.row.rowTitle) {
	case L("partnership") :
		view = Alloy.createController('commonUI/listScreen', {
			onScreen : "partnership",
		}).getView();
		title = L("partnership");
		break;
	case L("insurance") :
		view = Alloy.createController('commonUI/listScreen', {
			onScreen : "insurance_home",
		}).getView();
		title = L("insurance");
		break;
	case L("bill") :
		view = Alloy.createController('commonUI/listScreen', {
			onScreen : "bills",
		}).getView();
		title = L("bill");
		break;
	case L("medicalrecord") :
		view = Alloy.createController('commonUI/listScreen', {
			onScreen : "medicals",
		}).getView();
		title = L("medicalrecord");
		break;
	case L("document") :
		view = Alloy.createController('commonUI/listScreen', {
			onScreen : "documents",
		}).getView();
		title = L("document");
		break;
	case L("investment") :
		view = Alloy.createController('commonUI/listScreen', {
			onScreen : "investments",
		}).getView();
		title = L("investment");
		break;
	case L("check_in") :
		view = Alloy.createController('commonUI/listScreen', {
			onScreen : "check-in",
		}).getView();
		title = L("check_in");
		break;
	case L("hospitallocator") :
		Alloy.Globals.slider && Alloy.Globals.slider.toggleLeftWindow();
		openHospitalLocator();
		break;
	case L("settings") :
		view = Alloy.createController("settings/setting").getView();
		title = L("settings");
		break;
	default :
		view = Alloy.createController("notificationContent/notificationList").getView(),
		title = moment().format("dddd, MMM DD, YYYY");
	}
	if (e.row.rowTitle == L("hospitallocator")) {
		return;
	}
	utils.replaceCentralView({
		view : view,
		title : title
	});
	view = null;
	title = null;
}

function openHospitalLocator() {
	//intent chooser
	var intent = Ti.Android.createIntent({
		action : Ti.Android.ACTION_VIEW,
		data : Alloy.CFG.URL.hospitalLocator
	});
	var chooserIntent = Ti.Android.createIntentChooser(intent, "Choose Browser");
	Ti.Android.currentActivity.startActivity(chooserIntent);
}
