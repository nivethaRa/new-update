// var footer = require('bottomtabs');
// $.vendorDetailsWin.add(footer.createFooter());

function backClicked(e) {
	//Alloy.Globals.baseHomeView.add(Alloy.createController('/foodtruck/registration/registration').getView());
}

function completeClicked(e) {
	// Alloy.Globals.baseView.add(Alloy.createController('reviewsScreen').getView());
}

function openFavScreen(e) {
	// Alloy.Globals.baseView.add(Alloy.createController('favorites').getView());
}

var lineRev = Alloy.Globals.createBaseLine($.reviewsLbl);
$.rightView2.add(lineRev);

var lineMap = Alloy.Globals.createBaseLine($.mapItLbl);
$.leftView2.add(lineMap);



