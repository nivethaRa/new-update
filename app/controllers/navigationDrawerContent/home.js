var footer = require('bottomtabs'),
    serviceUtility = require('ServiceUtility'),
    utils = require("utils"),
    SFEZKeys = require("SFEZKeys");
var back;
var role = "";
if (Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO)) {
	role = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO).user.role;
}
(role == "") && ( role = "CUSTOMER");

if (Titanium.Filesystem.getFile(Alloy.Globals.profileImageUrl).exists()) {
	$.profileImage.image = Alloy.Globals.profileImageUrl;
}

function NavSlider(e) {
	$.drawermenu.showhidemenu();
}

function toggleSearch() {
	if ($.searchView.getZIndex() == 0) {
		$.searchView.setZIndex(2);
		$.searchView.animate({
			duration : 100,
			opacity : 1.0
		});
	} else {
		// $.tagsContainer.blur();
		$.searchView.animate({
			duration : 100,
			opacity : 0.0
		}, function() {
			$.searchView.setZIndex(0);
		});
	}
}

function openCart() {
	//Alloy.createController('myCart').getView().open();
}

Alloy.Globals.baseView = $.baseView;

Alloy.Globals.searchClicked = function(tab) {
	if (tab.fLbl.text == "Search") {
		utils.replaceCentralView({
			view : Alloy.createController('/consumer/searchPref').getView(),
			title : "Search"
		});
	} else if (tab.fLbl.text == "Check In") {
		//if checked in already move to check-in 3
		if (Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO) && Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO).checkIn) {
			utils.replaceCentralView({
				view : Alloy.createController('/foodtruck/checkins/checkin_third').getView(),
				title : "Check In"
			});
		} else {
			require("utils").replaceCentralView({
				view : Alloy.createController('/foodtruck/checkins/checkin_first').getView(),
				title : "Check In"
			});
		}
	}
};

Alloy.Globals.vendorListClicked = function(tab) {
	if (tab.sLbl.text == "Vendor List") {
		utils.replaceCentralView({
			view : Alloy.createController('/vendorList').getView(),
			title : "Vendor List"
		});
	} else if (tab.sLbl.text == "Specials") {
		require("utils").replaceCentralView({
			view : Alloy.createController('/foodtruck/specials').getView(),
			title : "Specials"
		});
	}
};

Alloy.Globals.loyaltyClicked = function(user_role) {
	Ti.API.info("**************loyaltyClicked************** " + user_role);
	if (user_role == "CUSTOMER") {
		utils.replaceCentralView({
			view : Alloy.createController('/loyaltyReview').getView(),
			title : "Loyalty"
		});
	} else {
		require("utils").replaceCentralView({
			view : Alloy.createController('/foodtruck/vendor_loyalty').getView(),
			title : "Loyalty"
		});
	}
};

Alloy.Globals.favoritesClicked = function(tab) {
	if (tab.frtLbl.text == "Specials") {
		utils.replaceCentralView({
			view : Alloy.createController('/dailySpecial').getView(),
			title : "Specials"
		});
	} else if (tab.frtLbl.text == "Reports") {
		require("utils").replaceCentralView({
			view : Alloy.createController('/foodtruck/truckReports').getView(),
			title : "Reports"
		});
	}
};

Alloy.Globals.orderClicked = function(tab) {
	if (tab.fftLbl.text == "Orders") {
		utils.replaceCentralView({
			view : Alloy.createController('order').getView(),
			title : "Orders"
		});
	} else if (tab.fftLbl.text == "Order Mgt.") {
		require("utils").replaceCentralView({
			view : Alloy.createController('/vendor_orders').getView(),
			title : "Order Mgt."
		});
	}
};

var customerLeftMenuItems = [{
	title : L('profile'),
	id : "profile",
}, {
	title : L('MapMyFood'),
	id : "mapmymood",
}, {
	title : L('Favorites'),
	id : "favorites",
}, {
	title : L('SettingsPushEvents'),
	id : "events",
}, {
	title : L('SignIn'),
	id : "signin",
}, {
	title : L('CreateAccount'),
	id : "create_account",
}];

var vendorLeftMenuItems = [{
	title : L('profile'),
	id : "profile",
}, {
	title : "Configuration",
	id : "configuration",

	title : L('SignIn'),
	id : "signin",
}, {
	title : L('CreateAccount'),
	id : "create_account",
},{
	title : 'Registration',
	id : "registration",
}/*
}, {
	title : "Menu Availability",
	id : "menu_available",
}, {
*/];	

function getTableRows(_role) {
	var data = (_role == "CUSTOMER") ? customerLeftMenuItems : vendorLeftMenuItems;
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

		if (data[i].id == "signin" || data[i].id == "create_account") {
			// row.backgroundColor="red",
		}

		dataRows.push(row);
	}

	return dataRows;
}

Alloy.Globals.getTableRows = getTableRows;

function createMenuDrawer() {

	var leftView = Ti.UI.createView({
		height : Ti.UI.FILL,
		layout : "vertical",
		backgroundColor : Alloy.Globals.mapsBackgroundColor,
		left : 0,
		width : Ti.UI.FILL
	});

	/*var mainLbl = Ti.UI.createLabel({
	 left : 15,
	 top : 22,
	 text : "Main Menu",
	 font : {
	 fontSize : 22,
	 fontFamily : 'Regular',
	 // fontWeight : "bold"
	 },
	 color : Alloy.Globals.normalTextColor,
	 });

	 leftView.add(mainLbl);*/

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
		text : "Matt Guiger",
		font : {
			fontSize : 12,
			fontFamily : 'Lucida Grande',
		},
		color : Alloy.Globals.darkTextColor,
	});
	Alloy.Globals.USERNAME = nameLbl;
	imgBackView.add(nameLbl);

	var sap = Ti.UI.createView({
		height : 2,
		width : Titanium.UI.FILL,
		top : 8,
		backgroundColor : "#CACACA"
	});
	leftView.add(sap);

	var menuTable = Ti.UI.createTableView({
		top : 10,
		backgroundColor : Alloy.Globals.mapsBackgroundColor,
	});

	leftView.add(menuTable);
	Alloy.Globals.menuTable = menuTable;
	menuTable.setData(getTableRows(role));

	menuTable.addEventListener("click", function(e) {
		if (e.source.id == "create_account") {
			//$.baseView.add(Alloy.createController('createAccount').getView());
			utils.replaceCentralView({
				view : Alloy.createController('registration').getView(),
				title : L('CreateAccount')
			});
		} else if (e.source.id == "profile") {
			//$.baseView.add(Alloy.createController('settings').getView());
			utils.replaceCentralView({
				view : Alloy.createController('settings').getView(),
				title : L('profile')
			});
		} else if (e.source.id == "signin") {
			//$.baseView.add(Alloy.createController('login').getView());
			utils.replaceCentralView({
				view : Alloy.createController('login').getView(),
				title : L('SignIn')
			});
		} else if (e.source.id == "favorites") {
			//$.baseView.add(Alloy.createController('login').getView());
			utils.replaceCentralView({
				view : Alloy.createController('favorites').getView(),
				title : L('Favorites')
			});
		} else if (e.source.id == "mapmymood") {
			//$.baseView.add(Alloy.createController('login').getView());
			utils.replaceCentralView({
				view : Alloy.createController('mapmyfood').getView(),
				title : L('MapMyFood')
			});
		} else if (e.source.id == "configuration") {
			//$.baseView.add(Alloy.createController('login').getView());
			utils.replaceCentralView({
				view : Alloy.createController('/foodtruck/configuration').getView(),
				title : "Configuration"
			});
		} else if (e.source.id == "menu_available") {
			//$.baseView.add(Alloy.createController('login').getView());
			utils.replaceCentralView({
				view : Alloy.createController('/foodtruck/menuAvailability').getView(),
				title : "Menu Availability"
			});
		} else if (e.source.id == "registration") {
			//$.baseView.add(Alloy.createController('login').getView());
			utils.replaceCentralView({
				view : Alloy.createController('/foodtruck/registration/registration').getView(),
				title : "Registration"
			});
		}				

		if (OS_ANDROID) {
			drawer.closeLeftWindow();
		} else {
			$.drawermenu.showhidemenu();
		}
	});
	var centralView = Alloy.createController('navigationDrawerContent/centerWindowView').createCenterView();
	if (OS_ANDROID) {
		var TiDrawerLayout = require('com.tripvi.drawerlayout');
		var drawer = TiDrawerLayout.createDrawer({
			leftView : leftView,
			centerView : centralView,
			//drawerLockMode:TiDrawerLayout.LOCK_MODE_LOCKED_CLOSED, // prevents user from swiping. manual use of toggleLeftWindow() still works
			//drawerIndicatorEnabled: false,

		});
		Alloy.Globals.currentWindow = drawer;
		$.home.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_UNSPECIFIED;
	} else {
		$.drawermenu.init({
			menuview : leftView,
			mainview : centralView,
			duration : 200,
			parent : $.home
		});

		$.drawermenu.addEventListener('open', function menuOpen() {
			Ti.API.info("Menu opened");
		});

		$.drawermenu.addEventListener('close', function menuOpen() {
			Ti.API.info("Menu closed");
		});
	}
	//
	// $.home.addEventListener("open", function() {
	// $.home.activity.actionBar.onHomeIconItemSelected = function() {
	// drawer.toggleLeftWindow();
	// };
	// });

	$.home.add(drawer);

	function openDrawer() {
		drawer.toggleLeftWindow();
	}


	$.home.addEventListener('open', function(evt) {
		// $.drawermenu.showhidemenu();
		if (OS_ANDROID) {
			var actionBar = evt.source.activity.actionBar;
			Alloy.Globals.actionBar = actionBar;
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

createMenuDrawer();
//$.baseView.add(footer.createFooter());
