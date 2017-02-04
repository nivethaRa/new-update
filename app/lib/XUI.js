var navShadowHeight = 2;
var navBarColor = "#000";
// workaround to 'alloy is not defined'
var Alloy = require('alloy'), _ = require("alloy/underscore")._;
// create Slider Navigation View
exports.createNView = function(params) {
	params = params || {};
	var defaults = {
		backgroundColor : '#fff',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		top : 0,
		layout : "absolute"
	};
	_.defaults(params, defaults);

	var navWin = null;
	if (OS_IOS) {
		navWin = Ti.UI.createWindow(params);
		navWin.statusBarStyle = Ti.UI.iPhone.StatusBar.LIGHT_CONTENT;
	}else{
		navWin = Ti.UI.createView(params);
	}
	
	return navWin;
};
