/*if (OS_ANDROID) {
 //localStorage.setItem(lastRole, "Vendor");
 var role = Ti.App.Properties.getString('lastRole');
 //localStorage.getItem(lastRole);
 if (role == "Consumer") {
 var consumerControl = Alloy.createController('index_consumer_android').getView();
 consumerControl.open();
 } else {
 Alloy.Globals.Services.User.role = "Vendor";
 var vendorControl = Alloy.createController('index_vendor_android').getView();
 vendorControl.open();
 }
 } else {

 Alloy.Globals.tabConsumer = $.tabConsumer;
 //getView();
 Alloy.Globals.tabVendor = $.tabVendor;

 $.tab_search.barColor = Alloy.Globals.navBarColor;
 $.tab_vender.barColor = Alloy.Globals.navBarColor;
 $.tab_loyalty.barColor = Alloy.Globals.navBarColor;
 $.tab_favorites.barColor = Alloy.Globals.navBarColor;
 $.tab_orders.barColor = Alloy.Globals.navBarColor;

 $.tab_checkIn.barColor = Alloy.Globals.navBarColor;
 $.tab_specialmenu.barColor = Alloy.Globals.navBarColor;
 $.tab_vloyalty.barColor = Alloy.Globals.navBarColor;
 $.tab_reports.barColor = Alloy.Globals.navBarColor;
 $.tab_ordersmgt.barColor = Alloy.Globals.navBarColor;

 function menuNavButtonHandler(e) {
 $.mainWindow.show();
 var role = Ti.App.Properties.getString('lastRole');
 if (role == "Consumer") {
 $.sidemenu.animate({
 left : 0,
 duration : 200
 });
 } else {
 $.sidemenuVendor.animate({
 left : 0,
 duration : 200
 });
 }
 // if (Alloy.Globals.Services.User.role == "Consumer") {
 // $.sidemenu.animate({
 // left : 0,
 // duration : 200
 // });
 // } else {
 // $.sidemenuVendor.animate({
 // left : 0,
 // duration : 200
 // });
 // }
 }

 $.sidemenu.addEventListener('swipe', function(e) {
 var direction = e.direction;
 var role = Ti.App.Properties.getString('lastRole');
 if (direction == "left") {
 if (role == "Consumer") {
 $.sidemenu.animate({
 left : -250,
 duration : 200
 }, function() {
 $.mainWindow.hide();
 });
 } else {
 $.sidemenuVendor.animate({
 left : -250,
 duration : 200
 }, function() {
 $.mainWindow.hide();
 });
 }
 // if (Alloy.Globals.Services.User.role == "Consumer") {
 // $.sidemenu.animate({
 // left : -250,
 // duration : 200
 // }, function() {
 // $.mainWindow.hide();
 // });
 // } else {
 // $.sidemenuVendor.animate({
 // left : -250,
 // duration : 200
 // }, function() {
 // $.mainWindow.hide();
 // });
 // }
 };
 });

 function checkOutNavButtonHandler(e) {
 alert('Open checkout');
 }

 //option clicked event
 function clickedOption(e) {
 var option = e.source.id;
 //alert(e.source.id);

 if (option == 'Vendor') {
 Ti.App.Properties.setString('lastRole', 'Vendor');
 Ti.App._restart();
 }
 if (option == 'Consumer') {
 Ti.App.Properties.setString('lastRole', 'Consumer');
 Ti.App._restart();
 }
 if (option == 'Profile') {

 }
 if (option == 'DailySpecial') {
 tabConsumer.setActiveTab(3);
 }
 if (option == 'Events') {

 }
 if (option == 'MyLoyalty') {
 tabConsumer.setActiveTab(2);
 }
 if (option == 'SearchPref') {

 }
 if (option == 'SignIn') {
 var loginControl = Alloy.createController('login').getView();
 loginControl.open();
 // var nav = Titanium.UI.iOS.createNavigationWindow({
 // window: loginControl,
 // modal:true
 // });
 // nav.open();
 // Alloy.Globals.Nav = nav;
 //loginControl.open();
 }
 if (option == 'CAccount') {
 var registerControl = Alloy.createController('registration').getView();
 registerControl.open();
 // var nav = Titanium.UI.iOS.createNavigationWindow({
 // window: registerControl,
 // modal:true
 // });
 // nav.open();
 // Alloy.Globals.Nav = nav;
 }

 //Vendor menu clicks
 if (option == 'CheckIn') {
 tabVendor.setActiveTab(0);
 }
 if (option == 'DailyVSpecial') {
 tabVendor.setActiveTab(1);
 }
 if (option == 'MenuAvailable') {

 }
 if (option == 'Report') {
 tabVendor.setActiveTab(3);
 }
 if (option == 'Review') {

 }
 var role = Ti.App.Properties.getString('lastRole');
 if (role == "Consumer") {
 $.sidemenu.animate({
 left : -250,
 duration : 200
 }, function() {
 $.mainWindow.hide();
 });
 } else {
 $.sidemenuVendor.animate({
 left : -250,
 duration : 200
 }, function() {
 $.mainWindow.hide();
 });
 }
 // if (Alloy.Globals.Services.User.role == "Consumer") {
 // $.sidemenu.animate({
 // left : -250,
 // duration : 200
 // }, function() {
 // $.mainWindow.hide();
 // });
 // } else {
 // $.sidemenuVendor.animate({
 // left : -250,
 // duration : 200
 // }, function() {
 // $.mainWindow.hide();
 // });
 // }
 }

 var tabConsumer = Alloy.Globals.tabConsumer,
 tabVendor = Alloy.Globals.tabVendor;

 //$.index.open();
 //tabConsumer.open();
 //tabConsumer.show();
 tabVendor.open();

 //$.mainWindow.add(tab_group);
 $.mainWindow.hide();
 $.mainWindow.open();

 }*/

Alloy.Globals.notifyError = function(e) {
	alert("Error\n" + e);
	Ti.API.error("Error\n" + e);
};

Alloy.Globals.notifyCallback = function(e) {
	Ti.API.info("*************notifyCallback**************");
	require("notificationCallBack").notificationCallBack(e);
};
Alloy.Globals.notifyUnregister = function(e) {
	alert("unregister\n" + e);
};
Alloy.Globals.notifyData = function(e) {
	Ti.API.info("*************notifyData**************");
	require("notificationCallBack").notificationCallBack(e);
};
//push notification for android and iOS
var notifySuccessGetId = function(id) {
	Ti.API.error("push id got :" + id);
	/*if (Alloy.Globals.getData("deviceId") == null) {
		Alloy.Globals.setData("deviceId", id);
	}*/
	if (OS_ANDROID) {
		Alloy.Globals.isPushEnabled = true;
	}
};
function registerGCM() {
	Ti.App.Properties.setBool("RegisteredGCM",false);
	Ti.API.info("**************registerGCM*****************");
	require('pushNotification').getPushNotification({
		success : notifySuccessGetId,
		error : Alloy.Globals.notifyError,
		callback : Alloy.Globals.notifyCallback,
		unregister : Alloy.Globals.notifyUnregister,
		data : Alloy.Globals.notifyData,
	});
}

function waitForOnline() {
	Ti.API.error('q:waitForOnline');
	Titanium.Network.online ? registerGCM() : setTimeout(waitForOnline, 3000);
};
if (!ENV_DEV) {
	waitForOnline();
}
Alloy.createController('navigationDrawerContent/home').getView().open();


//Alloy.Globals.Services.User.sendUserDeviceTokenToServer();
