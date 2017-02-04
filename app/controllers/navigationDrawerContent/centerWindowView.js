var utils = require("utils");
var SFEZKeys = require("SFEZKeys");
if ( typeof moment === 'undefined') {
	moment = require('alloy/moment');
}

exports.createCenterView = function() {
	var ui = require('XUI');
	var args = null;
	var mainView = ui.createNView(args);
	Alloy.Globals.mainView = mainView;
	var baseView = Ti.UI.createView({
		layout : "absolute",
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		bottom : 0,
		zIndex : 1,
		backgroundColor : "green"
	});
	mainView.add(baseView);
	var role = "";
	if (Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO)) {
		role = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO).user.role;
	}
	(role == "") && ( role = "CUSTOMER");
	baseView.add(require('bottomtabs').createConsumerFooter(role));
	Alloy.Globals.centralView = Ti.UI.createView({
		backgroundColor : "transparent",
		top : 0,
		bottom : 0,
	});
	mainView.add(Alloy.Globals.centralView);
	Alloy.Globals.mainView.baseView = baseView;
	if (role == "CUSTOMER") {
		utils.replaceCentralView({
			view : Alloy.createController('mapmyfood').getView(),
			title : L('MapMyFood')
		});
	} else {
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
	if (OS_ANDROID) {
		Alloy.Globals.navWindow = mainView;
		return mainView;
	} else {
		var navWin = Ti.UI.iOS.createNavigationWindow({
			top : 0,
			window : mainView,
			statusBarStyle : Ti.UI.iPhone.StatusBar.LIGHT_CONTENT,
		});
		Alloy.Globals.navWindow = mainView;
		return navWin;
	}
};
