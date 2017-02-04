var footer_ft = require('truckbottomtabs');
var back;
if (OS_ANDROID) {
	// $.home_truck.addEventListener('android:back', function(e) {
	// if (back)
	// back();
	// });
}
function NavSlider(e) {
	$.drawermenu.showhidemenu();
}

Alloy.Globals.baseHomeView = $.baseHomeView;
$.baseHomeView.add(Alloy.createController('/foodtruck/checkins/checkin_first').getView());

Alloy.Globals.checkInClicked = function() {
	Ti.API.info('checkin');
	// $.baseHomeView.remove($.searchView);
	$.baseHomeView.add(Alloy.createController('/foodtruck/checkins/checkin_first').getView());
};

Alloy.Globals.specialMenuClicked = function() {
	// $.baseHomeView.remove($.searchView);
	$.baseHomeView.add(Alloy.createController('/foodtruck/specials').getView());
};

Alloy.Globals.truckLoyaltyClicked = function() {
	$.baseHomeView.add(Alloy.createController('loyaltyReview').getView());
	// $.baseHomeView.remove($.searchView);
	// $.baseHomeView.add(Alloy.createController('favorites').getView());
};

Alloy.Globals.reportsClicked = function() {
	// $.baseHomeView.remove($.searchView);
	$.baseHomeView.add(Alloy.createController('/foodtruck/truckReports').getView());
};

Alloy.Globals.orderMgtClicked = function() {
	// $.baseHomeView.remove($.searchView);
	// $.baseHomeView.add(Alloy.createController('order').getView());
};

function createTruckMenuDrawer() {

	var leftView = Ti.UI.createView({
		height : Ti.UI.FILL,
		layout : "vertical",
		backgroundColor : Alloy.Globals.mapsBackgroundColor,
		left : 0,
		width : Ti.UI.FILL
	});

	// var mainLbl = Ti.UI.createLabel({
	// left : 15,
	// top : 22,
	// text : "Paco's Tacos",
	// font : {
	// fontSize : 22,
	// fontFamily : 'Regular',
	// // fontWeight : "bold"
	// },
	// color : Alloy.Globals.normalTextColor,
	// });
	//
	// leftView.add(mainLbl);

	var imgBackView = Ti.UI.createView({
		top : 8,
		height : 50,
		layout : "horizontal",
		backgroundColor : Alloy.Globals.mapsBackgroundColor,
		left : 0,
		width : Ti.UI.FILL
	});

	leftView.add(imgBackView);

	var iconImg = Ti.UI.createImageView({
		left : Alloy.Globals.navigatorIconPadding,
		height : 48,
		width : 48,
		bottom : 5,
		image : "/images/user.png"
	});

	imgBackView.add(iconImg);

	var nameLbl = Ti.UI.createLabel({
		left : 15,
		top : 15,
		text : "Paco's Tacos",
		font : {
			fontSize : 20,
			fontFamily : 'Regular',
		},
		color : Alloy.Globals.darkTextColor,
	});

	imgBackView.add(nameLbl);

	var sap = Ti.UI.createView({
		height : 2,
		width : Titanium.UI.FILL,
		top : 8,
		backgroundColor : "#CACACA"
	});
	leftView.add(sap);

	var data = [{
		title : L('Check_In'),
		id : "checkin",
	}, {
		title : L('DailySpecials'),
		id : "daily_special",
	}, {
		title : L('MenuAvailability'),
		id : "menu_availability",
	}, {
		title : "Reporting",
		id : "reporting",
	}, {
		title : L('Reviews'),
		id : "reviews",
	}, {
		title : "Create account",
		id : "create_account",
	}, {
		title : "Sign In",
		id : "signin",
	}, {
		title : "Registration",
		id : "registration",
	}];

	var menuTable = Ti.UI.createTableView({
		top : 10,
		backgroundColor : Alloy.Globals.mapsBackgroundColor,
	});

	leftView.add(menuTable);

	var dataRows = [];
	for (var i = 0; i < data.length; i++) {

		var row = Ti.UI.createTableViewRow({
			height : 30,
			left : 0,
			right : 0,
			id : data[i].id,
			backgroundColor : Alloy.Globals.mapsBackgroundColor,
		});

		var titleLbl = Ti.UI.createLabel({
			touchEnabled : false,
			left : 15,
			top : 5,
			text : data[i].title,
			font : {
				fontSize : 14,
				fontFamily : 'Lucida Grande',

			},
			color : Alloy.Globals.darkTextColor,
		});

		row.add(titleLbl);

		if (data[i].id == "signin" || data[i].id == "create_account" || data[i].id == "registration") {
			row.backgroundColor = "#FFF";
		}

		dataRows.push(row);
	}

	menuTable.setData(dataRows);

	menuTable.addEventListener("click", function(e) {
		if (e.source.id == "create_account") {
			$.baseHomeView.add(Alloy.createController('/foodtruck/createAccount').getView());
		} else if (e.source.id == "reviews") {
			$.baseHomeView.add(Alloy.createController('reviewsScreen').getView());
		} else if (e.source.id == "daily_special") {
			$.baseHomeView.add(Alloy.createController('/foodtruck/specials').getView());
		} else if (e.source.id == "reporting") {
			$.baseHomeView.add(Alloy.createController('/foodtruck/truckReports').getView());
		} else if (e.source.id == "registration") {
			$.baseHomeView.add(Alloy.createController('/foodtruck/registration/registration').getView());
		} else if (e.source.id == "checkin") {
			$.baseHomeView.add(Alloy.createController('/foodtruck/checkins/checkin_first').getView());
		}else if (e.source.id == "menu_availability") {
			$.baseHomeView.add(Alloy.createController('/foodtruck/menuAvailability').getView());
		}
		if (OS_ANDROID) {
			drawer.closeLeftWindow();
		} else {
			$.drawermenu.showhidemenu();
		}

	});

	if (OS_ANDROID) {
		var TiDrawerLayout = require('com.tripvi.drawerlayout');

		var drawer = TiDrawerLayout.createDrawer({
			leftView : leftView,
			centerView : $.baseHomeView,
			//drawerLockMode:TiDrawerLayout.LOCK_MODE_LOCKED_CLOSED, // prevents user from swiping. manual use of toggleLeftWindow() still works
			//drawerIndicatorEnabled: false,

		});

	} else {
		$.drawermenu.init({
			menuview : leftView,
			mainview : $.mainScrollableView,
			duration : 200,
			parent : $.home_truck
		});

		$.drawermenu.addEventListener('open', function menuOpen() {
			Ti.API.info("Menu opened");
		});

		$.drawermenu.addEventListener('close', function menuOpen() {
			Ti.API.info("Menu closed");
		});
	}
	//
	// $.home_truck.addEventListener("open", function() {
	// $.home_truck.activity.actionBar.onHomeIconItemSelected = function() {
	// drawer.toggleLeftWindow();
	// };
	// });

	$.home_truck.add(drawer);

	function openDrawer() {
		drawer.toggleLeftWindow();
	}


	$.home_truck.addEventListener('open', function(evt) {
		// $.drawermenu.showhidemenu();
		if (OS_ANDROID) {
			var actionBar = evt.source.activity.actionBar;
			if (actionBar) {
				actionBar.displayHomeAsUp = true;
				actionBar.backgroundImage = "/images/topBar.png";

				actionBar.onHomeIconItemSelected = function(e) {
					drawer.toggleLeftWindow();
				};
			}
		}
	});

}

// if (Ti.Platform.Android) {
createTruckMenuDrawer();
// }
$.baseHomeView.add(footer_ft.createTruckFooter());

