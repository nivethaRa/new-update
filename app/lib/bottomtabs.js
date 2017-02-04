exports.createConsumerFooter = function(role) {

	var consumerTabNames = ["Search", "Vendor List", "Loyalty", "Specials", "Orders"];
	var vendorTabNames = ["Check In", "Specials", "Loyalty", "Reports", "Order Mgt."];
	var consumerTabImages = ["images/tabicons/search.png", "images/tabicons/list.png", "images/tabicons/loyality.png", "images/tabicons/special_menu.png", "images/tabicons/order.png"];
	var vendorTabImages = ["images/tabicons/checkin.png", "images/tabicons/special_menu.png", "images/tabicons/loyality.png", "images/tabicons/reports.png", "images/tabicons/order.png"];

	var tabs = (role == "CUSTOMER") ? consumerTabNames : vendorTabNames;
	var images = (role == "CUSTOMER") ? consumerTabImages : vendorTabImages;

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
		backgroundColor : Alloy.Globals.windowBackgroundColor2,
	});
	baseView.add(firstTab);

	var fImg = Ti.UI.createImageView({
		touchEnabled : false,
		top : 5,
		height : 30,
		width : 30,
		left : 18,
		image : images[0],
	});

	firstTab.add(fImg);

	var fLbl = Ti.UI.createLabel({
		touchEnabled : false,
		text : tabs[0],
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		textAlign : "center",
		bottom : 3,
		color : "#FFF",
	});

	firstTab.fLbl = fLbl;

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
		image : images[1],
	});

	secondTab.add(sImg);

	var sLbl = Ti.UI.createLabel({
		touchEnabled : false,
		text : tabs[1],
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		textAlign : "center",
		bottom : 3,
		color : "#FFF",
	});

	secondTab.add(sLbl);

	secondTab.sLbl = sLbl;

	thirdTab = Ti.UI.createView({
		bottom : 0,
		left : 2,
		height : 55,
		width : "19.5%",
		backgroundColor : Alloy.Globals.windowBackgroundColor2,
	});
	baseView.add(thirdTab);

	var tImg = Ti.UI.createImageView({
		touchEnabled : false,
		top : 5,
		height : 30,
		width : 30,
		left : 18,
		image : images[2],
	});

	thirdTab.add(tImg);

	var tLbl = Ti.UI.createLabel({
		touchEnabled : false,
		text : tabs[2],
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		textAlign : "center",
		bottom : 3,
		color : "#FFF",
	});

	thirdTab.add(tLbl);

	thirdTab.tLbl = tLbl;

	fourthTab = Ti.UI.createView({
		bottom : 0,
		left : 2,
		height : 55,
		width : "19.5%",
		backgroundColor : Alloy.Globals.windowBackgroundColor2,
	});
	baseView.add(fourthTab);

	var frtImg = Ti.UI.createImageView({
		touchEnabled : false,
		top : 5,
		height : 30,
		width : 30,
		left : 18,
		image : images[3],
	});

	fourthTab.add(frtImg);

	var frtLbl = Ti.UI.createLabel({
		touchEnabled : false,
		text : tabs[3],
		font : {
			fontSize : 10,
			// fontFamily : 'Lucida Grande',
		},
		textAlign : "center",
		bottom : 3,
		color : "#FFF",
	});

	fourthTab.add(frtLbl);

	fourthTab.frtLbl = frtLbl;

	fifthTab = Ti.UI.createView({
		bottom : 0,
		left : 2,
		height : 55,
		width : "19.5%",
		backgroundColor : Alloy.Globals.windowBackgroundColor2,
	});
	baseView.add(fifthTab);

	var fftImg = Ti.UI.createImageView({
		touchEnabled : false,
		top : 5,
		height : 30,
		width : 30,
		left : 18,
		image : images[4],
	});

	fifthTab.add(fftImg);

	var fftLbl = Ti.UI.createLabel({
		touchEnabled : false,
		text : tabs[4],
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		textAlign : "center",
		bottom : 3,
		color : "#FFF",
	});

	fifthTab.add(fftLbl);

	fifthTab.fftLbl = fftLbl;

	firstTab.addEventListener("click", function() {
		Ti.API.info("FIRST");
		Alloy.Globals.searchClicked(this);

	});

	secondTab.addEventListener("click", function(e) {
		Ti.API.info("SECOND");
		Alloy.Globals.vendorListClicked(this);

	});
	thirdTab.addEventListener("click", function(e) {
		Alloy.Globals.loyaltyClicked(role);

	});

	fourthTab.addEventListener("click", function(e) {
		Alloy.Globals.favoritesClicked(this);
	});

	fifthTab.addEventListener("click", function(e) {
		Alloy.Globals.orderClicked(this);

	});

	return baseView;

};
