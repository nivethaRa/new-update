// create footer view for all windows
var firstTab;
var secondTab;
var thirdTab;
var fifthTab;
var fourthTab;
var lastTab;

exports.createTruckFooter = function() {

	var baseView = Ti.UI.createView({
		bottom : 0,
		height : 55,
		left : 0,
		right : 0,
		backgroundColor : Alloy.Globals.windowBackgroundColor,
		layout : "horizontal",
	});

	firstTab = Ti.UI.createView({
		bottom : 0,
		left : 0,
		height : 55,
		width : "19.5%",
		backgroundColor : Alloy.Globals.buttonColor3,
		// backgroundColor : Alloy.Globals.windowBackgroundColor2,
	});
	baseView.add(firstTab);
	lastTab = firstTab;

	var fImg = Ti.UI.createImageView({
		touchEnabled : false,
		top : 5,
		height : 30,
		width : 30,
		left : 18,
		image : "/images/location_pin.png",
	});

	firstTab.add(fImg);

	var fLbl = Ti.UI.createLabel({
		touchEnabled : false,
		text : "Check in",
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		textAlign : "center",
		bottom : 3,
		color : "#FFF",
	});

	firstTab.add(fLbl);
	secondTab = Ti.UI.createView({
		bottom : 0,
		left : 2,
		height : 55,
		width : "19.5%",
		backgroundColor : Alloy.Globals.windowBackgroundColor2,
	});
	baseView.add(secondTab);

	var sImg = Ti.UI.createImageView({
		touchEnabled : false,
		top : 5,
		height : 30,
		width : 30,
		left : 18,
		image : "/images/bottom_nav_specials_menu.png",
		// image : "/images/active-search.png",
	});

	secondTab.add(sImg);

	var sLbl = Ti.UI.createLabel({
		touchEnabled : false,
		text : "Specials/Menu",
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		textAlign : "center",
		bottom : 3,
		color : "#FFF",
	});

	secondTab.add(sLbl);

	thirdTab = Ti.UI.createView({
		bottom : 0,
		left : 2,
		height : 55,
		width : "19.5%",
		backgroundColor : Alloy.Globals.windowBackgroundColor2,
		// image : "/images/active-search.png",
	});
	baseView.add(thirdTab);

	var tImg = Ti.UI.createImageView({
		touchEnabled : false,
		top : 5,
		height : 30,
		width : 30,
		left : 18,
		image : "/images/bottom_nav_loyalty.png",
		// image : "/images/active-search.png",
	});

	thirdTab.add(tImg);

	var tLbl = Ti.UI.createLabel({
		touchEnabled : false,
		text : L('BottomBarLoyalty'),
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		textAlign : "center",
		bottom : 3,
		color : "#FFF",
	});

	thirdTab.add(tLbl);

	fourthTab = Ti.UI.createView({
		bottom : 0,
		left : 2,
		height : 55,
		width : "19.5%",
		backgroundColor : Alloy.Globals.windowBackgroundColor2,
		// image : "/images/active-search.png",
	});
	baseView.add(fourthTab);

	var frtImg = Ti.UI.createImageView({
		touchEnabled : false,
		top : 5,
		height : 30,
		width : 30,
		left : 18,
		image : "/images/bottom_nav_reports.png",
		// image : "/images/active-search.png",
	});

	fourthTab.add(frtImg);

	var frtLbl = Ti.UI.createLabel({
		touchEnabled : false,
		text : L('Reports'),
		font : {
			fontSize : 10,
			// fontFamily : 'Lucida Grande',
		},
		textAlign : "center",
		bottom : 3,
		color : "#FFF",
	});

	fourthTab.add(frtLbl);

	fifthTab = Ti.UI.createView({
		bottom : 0,
		left : 2,
		height : 55,
		width : "19.5%",
		backgroundColor : Alloy.Globals.windowBackgroundColor2,
		// image : "/images/active-search.png",
	});
	baseView.add(fifthTab);

	var fftImg = Ti.UI.createImageView({
		touchEnabled : false,
		top : 5,
		height : 30,
		width : 30,
		left : 18,
		image : "/images/bottom_nav_orders.png",
		// image : "/images/active-search.png",
	});

	fifthTab.add(fftImg);

	var fftLbl = Ti.UI.createLabel({
		touchEnabled : false,
		text : L("OrderManagement"),
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		textAlign : "center",
		bottom : 3,
		color : "#FFF",
	});

	fifthTab.add(fftLbl);

	firstTab.addEventListener("click", function(e) {
		Alloy.Globals.checkInClicked();
		lastTab.backgroundColor = Alloy.Globals.windowBackgroundColor2;
		firstTab.backgroundColor = Alloy.Globals.buttonColor3;
		lastTab = firstTab;
	});

	secondTab.addEventListener("click", function(e) {
		Alloy.Globals.specialMenuClicked();
		lastTab.backgroundColor = Alloy.Globals.windowBackgroundColor2;
		secondTab.backgroundColor = Alloy.Globals.buttonColor3;
		lastTab = secondTab;

	});
	thirdTab.addEventListener("click", function(e) {
		Alloy.Globals.truckLoyaltyClicked();
		lastTab.backgroundColor = Alloy.Globals.windowBackgroundColor2;
		thirdTab.backgroundColor = Alloy.Globals.buttonColor3;
		lastTab = thirdTab;
	});

	fourthTab.addEventListener("click", function(e) {
		Alloy.Globals.reportsClicked();
		lastTab.backgroundColor = Alloy.Globals.windowBackgroundColor2;
		fourthTab.backgroundColor = Alloy.Globals.buttonColor3;
		lastTab = fourthTab;
	});

	fifthTab.addEventListener("click", function(e) {
		Alloy.Globals.orderMgtClicked();
		lastTab.backgroundColor = Alloy.Globals.windowBackgroundColor2;
		fifthTab.backgroundColor = Alloy.Globals.buttonColor3;
		lastTab = fifthTab;
	});

	return baseView;

};
