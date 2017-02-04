// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

//CONSTANTS

Alloy.Globals.windowBackgroundColor = "#21252B";
Alloy.Globals.windowBackgroundColor2 = "#282C34";
Alloy.Globals.windowBackgroundColor3 = "#1B1D23";
Alloy.Globals.vendors = [];
//navigation bar color
Alloy.Globals.navBarColor = "#67C5EB";
Alloy.Globals.tabBarColor = "#222222";
//BLACK

Alloy.Globals.windowBackgroundLight = "#EDEDE6";
Alloy.Globals.mapsBackgroundColor = "#F0EDE5";
Alloy.Globals.lightTextColor = "#E2E2E2";
Alloy.Globals.normalTextColor = "#BDC5D4";
Alloy.Globals.darkTextColor = "#6B717D";
Alloy.Globals.normalInputTextColor = "#21252B";
Alloy.Globals.disabledInputTextColor = "#565D6A";
Alloy.Globals.fieldBackground = "#fff";
Alloy.Globals.buttonColor = "#68AFCC";
//blue
Alloy.Globals.buttonColor2 = "#A53D3D";
//red
Alloy.Globals.buttonColor3 = "#6494ED";
//blue2
Alloy.Globals.buttonColor4 = "#324C5C";
//darkBlue
Alloy.Globals.buttonColor5 = "#1B1D23";
//BLACK
//Dark color
Alloy.Globals.primaryColor = "#8B0A50";

Alloy.Globals.textFieldBorderRadius = 3;

Alloy.Globals.bronzeJujo = 5;
Alloy.Globals.silverJujo = 10;
Alloy.Globals.goldJujo = 20;
Alloy.Globals.actionBar = null;


Alloy.Globals.JWTToken = "";

Alloy.Globals.isiOS7Plus = function() {
	// iOS-specific test
	if (Titanium.Platform.name == 'iPhone OS') {
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0], 10);
		// Can only test this support on a 3.2+ device
		if (major >= 7) {
			return true;
		}
	}
	return false;
};

Alloy.Globals.topMargin = (Alloy.Globals.isiOS7Plus() ? 20 : 0);
Alloy.Globals.navigatorHeight = 45;
Alloy.Globals.bottomNavigatorHeight = 55;
//65
Alloy.Globals.bottomNavigatorLarge = 80;
Alloy.Globals.navigatorIconHeight = 32;
Alloy.Globals.navigatorIconHeightSmall = 24;
Alloy.Globals.navigatorIconPadding = 10;
Alloy.Globals.largerIconPadding = 40;
Alloy.Globals.profileImageHeight = 128;
Alloy.Globals.defaultButtonHeight = 45;
Alloy.Globals.searchButtonHeight = 35;
Alloy.Globals.bigIconHeight = 48;
Alloy.Globals.myCurrentWin = "home";

Alloy.Globals.Map = require('ti.map');
Alloy.Globals.Facebook = require('facebook');
Alloy.Globals.Cloud = require('ti.cloud');
if (OS_ANDROID) {
	Alloy.Globals.CloudPush = require('ti.cloudpush');
}
Alloy.Globals.BarCode = require('ti.barcode');
Alloy.Globals.Cloud.sessionId = Ti.App.Properties.getString("session_id");
Alloy.Globals.foodTruckRoleString = "foodtruck";

Alloy.Globals.loading = Alloy.createWidget("nl.fokkezb.loading");



//Manpreet Singh

Alloy.Globals.androidDeviceToken = "";


Alloy.Globals.isFoodTruck = function() {
	if (Alloy.Globals.currentUser && Alloy.Globals.currentUser.role == Alloy.Globals.foodTruckRoleString) {
		return true;
	} else {
		return false;
	}
};

Alloy.Globals.profileImageUrl = function() {
	return Ti.Filesystem.applicationDataDirectory + 'profile.jpg';
}();

Alloy.Globals.userQrImage = function() {
	return Ti.Filesystem.applicationDataDirectory + 'qrUser.jpg';
}();

Alloy.Globals.simpleAlert = function(message, callback, callbackCancel) {
	var dialog = Titanium.UI.createAlertDialog({
		message : message,
		cancel : 1,
		buttonNames : [L("alert_label_ok"), L("alert_label_cancel")],
		title : L("alert_label_title")
	});

	dialog.addEventListener("click", function(e) {
		if (e.index === e.source.cancel) {
			if (callbackCancel) {
				callbackCancel();
			}
		} else {
			if (callback) {
				callback();
			}
		}
	});
	dialog.show();
};

Alloy.Globals.applyLabelToTextField = function(textField, label, isPassword) {
	textField.color = Alloy.Globals.disabledInputTextColor;
	if (isPassword) {
		textField.passwordMask = false;
	}
	textField.value = L(label);
	textField.addEventListener("focus", function() {
		if (textField.value == L(label)) {
			textField.value = "";
			textField.color = Alloy.Globals.normalInputTextColor;
			if (isPassword) {
				textField.passwordMask = true;
			}
		}
	});
	textField.addEventListener("blur", function() {
		if (textField.value == "") {
			textField.value = L(label);
			textField.color = Alloy.Globals.disabledInputTextColor;
			if (isPassword) {
				textField.passwordMask = false;
			}
		}
	});
};

Alloy.Globals.deviceToken = null;
Alloy.Globals.generateDeviceToken = function() {
	// Process incoming push notifications
	function receivePush(e) {
		var ostype = Titanium.Platform.osname;
		var alertString = "";
		if (ostype === "android") {
			alertString = JSON.parse(e.payload).android.alert;
		}
		if (ostype === "iphone" || ostype === "ipad") {
			alertString = e.data.aps.alert;
		}

		alert(alertString);
	}

	// Save the device token for subsequent API calls
	function deviceTokenSuccess(e) {
		Alloy.Globals.deviceToken = e.deviceToken;
		//Ti.API.info("Device token: "+Alloy.Globals.deviceToken);
		//registerGlobalChanelPush();
	}

	function deviceTokenError(e) {
		//Ti.API.info('Failed to register for push notifications! ' + e.error);
	}

	// Check if the device is running iOS 8 or later
	if (Ti.Platform.name == "iPhone OS") {
		if (parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
			// Wait for user settings to be registered before registering for push notifications
			Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
				// Remove event listener once registered for push notifications
				Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
				Ti.Network.registerForPushNotifications({
					success : deviceTokenSuccess,
					error : deviceTokenError,
					callback : receivePush
				});
			});

			// Register notification types to use
			Ti.App.iOS.registerUserNotificationSettings({
				types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
			});
		} else {
			// For iOS 7 and earlier
			Ti.Network.registerForPushNotifications({
				// Specifies which notifications to receive
				types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
				success : deviceTokenSuccess,
				error : deviceTokenError,
				callback : receivePush
			});
		}
	} else {
		//FOR android
		// Initialize the module
		Alloy.Globals.CloudPush.retrieveDeviceToken({
			success : deviceTokenSuccess,
			error : deviceTokenError
		});

		// Process incoming push notifications
		Alloy.Globals.CloudPush.addEventListener('callback', function(evt) {
			receivePush(evt);
		});
	}
};

Alloy.Globals.registerGlobalChanelPush = function() {
	Alloy.Globals.Cloud.PushNotifications.subscribe({
		channel : 'global',
		device_token : Alloy.Globals.deviceToken,
		type : Ti.Platform.name == 'android' ? 'gcm' : 'ios'
	}, function(e) {
		if (e.success) {
			//Ti.API.info(Alloy.Globals.deviceToken + " Subscribed to global channel");
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
	// Alloy.Globals.Cloud.PushNotifications.subscribeToken({
	//     device_token: Alloy.Globals.deviceToken,
	//     channel: 'global',
	//     type: Ti.Platform.name == 'android' ? 'gcm' : 'ios'
	// }, function (e) {
	//     if (e.success) {
	//         Ti.API.info(Alloy.Globals.deviceToken + " Subscribed to global channel");
	//     } else {
	//         alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	//     }
	// });
};

Alloy.Globals.createBaseLine = function(obj) {
	var lineView = Ti.UI.createView({
		height : 2,
		top : 0,
	});

	lineView.width = obj.toImage().width;
	lineView.backgroundColor = obj.color;
	lineView.left = obj.left;

	return lineView;
};

Alloy.Globals.openMedia = function(imgName, obj) {
	var opts = {
		cancel : 1,
		options : ['Gallery', 'Cancel'],
		// selectedIndex : 0,
		destructive : 0,
		title : 'Choose Photo From:'
	};
	var opt_dialog = Ti.UI.createOptionDialog(opts);
	opt_dialog.addEventListener('click', function(e) {
		if (e.index == 0) {
			openGallary(imgName, obj);
		}
		// else if (e.index == 1) {
		// openCamera(imgName, obj);
		// }
		Ti.API.info('string  ' + JSON.stringify(e));
	});
	opt_dialog.show();
};

function openGallary(imgName, obj) {
	try {

		Titanium.Media.openPhotoGallery({
			success : function(event) {
				if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					obj.image = event.media;

					var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imgName);
					if (f.exists()) {
						f.deleteFile();
						f.write(event.media);
					} else {
						f.write(event.media);
					}
				} else {
					//alertBox.setMessage('You can select only photoes.');
					//alertBox.show();
				}
			},
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
		});
	} catch(e) {

	}
}

// function openCamera(imgName, obj) {
// Titanium.Media.showCamera({
//
// success : function(event) {
// obj.image = event.media;
// var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imgName);
// if (f.exists()) {
// f.deleteFile();
// f.write(event.media);
// } else {
// f.write(event.media);
// }
// Ti.API.debug('Our type was: ' + event.mediaType);
//
// },
//
// error : function(error) {
// // create alert
// var a = Titanium.UI.createAlertDialog({
// title : 'Camera'
// });
//
// // set message
// if (error.code == Titanium.Media.NO_CAMERA) {
// a.setMessage('Please run this test on device');
// } else {
// a.setMessage('Unexpected error: ' + error.code);
// }
// // show alert
// a.show();
// },
// saveToPhotoGallery : true,
// allowEditing : true,
// mediaTypes : [Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO],
// });
// }

//load services
Alloy.Globals.Services = require('AppServices');

//check if user is logged in or not ?
Alloy.Globals.Services.User.checkUserLoggedIn();
//console.log(Alloy.Globals.Services.pullString());

Alloy.Globals.currentLat = 0.0;
Alloy.Globals.currentLng = 0.0;

/* Alloy.Globals.GetCurrentUesrLocation = function() {
 Ti.Geolocation.purpose = L('locationPurpose');
 Titanium.Geolocation.getCurrentPosition(function(e) {
 if (e.error) {
 Alloy.Globals.simpleAlert(L('locationError'));
 } else {
 var c = e.coords;
 c.latitudeDelta = 0.05;
 c.longitudeDelta = 0.05;
 Alloy.Globals.currentLat = c.latitude;
 Alloy.Globals.currentLng = c.longitude;
 }
 });
 };*/

Alloy.Globals.GetDistanceFromLocation = function(sLat, sLng,isMile) {
	var lat1 = Alloy.Globals.currentLat;
	var lon1 = Alloy.Globals.currentLng;
	var lat2 = sLat;
	var lon2 = sLng;
	var p = 0.017453292519943295;
	// Math.PI / 180
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
	var MILES_TO_KM = 1.60934;
	var KM = 12742 * Math.asin(Math.sqrt(a));
	// 2 * R; R = 6371 km
	//return (KM * MILES_TO_KM) + " mi";
	if(isMile)
		/*return (parseFloat(Math.round(KM * 10) / 10)*0.621371).toFixed(1) +"ml";*/
		
		//Edited By Aryvart
		return (parseFloat(Math.round(KM * 10) / 10)*0.621371).toFixed(1) +" km";
		
	else
		return (Math.round(KM * 10) / 10).toFixed(1) + " km";
};

//Set Data In Application Local Storage
var setData = function(key, values) {
	Ti.API.info("setting " + key + " info");
	var stringified = JSON.stringify(values);
	Ti.App.Properties.setString(key, stringified);
};

//Get Data In Application Local Storage
var getData = function(key) {
	var stringifiedValue = Ti.App.Properties.getString(key, null);
	if (stringifiedValue) {
		return JSON.parse(stringifiedValue);
	} else {
		return null;
	}
};

Alloy.Globals.setData = setData;
Alloy.Globals.getData = getData;


// var gcm = require('net.iamyellow.gcmjs');
// 
// var pendingData = gcm.data;
// if (pendingData && pendingData !== null) {
	// // if we're here is because user has clicked on the notification
	// // and we set extras for the intent 
	// // and the app WAS NOT running
	// // (don't worry, we'll see more of this later)
// 	
	// Ti.API.info('******* data (started) ' + JSON.stringify(pendingData));
// }
// 
// gcm.registerForPushNotifications({
	// success: function (ev) {
		// // on successful registration
		// //alert('******* success, ' + ev.deviceToken);
// 		
		// Alloy.Globals.androidDeviceToken =  ev.deviceToken;
		// //alert(Alloy.Globals.androidDeviceToken);
		// Ti.API.info('******* Alloy.Globals.androidDeviceToken, ' + ev.deviceToken);
		// Alloy.Globals.setData("deviceId", ev.deviceToken);
	// },
	// error: function (ev) {
		// // when an error occurs
		// Ti.API.info('******* error, ' + ev.error);
	// },
	// callback: function () {
		// // when a gcm notification is received WHEN the app IS IN FOREGROUND
		// //alert('hellow yellow!');
		// alert(evt);
	// },
	// unregister: function (ev) {
		// // on unregister 
		// Ti.API.info('******* unregister, ' + ev.deviceToken);
	// },
	// data: function (data) {
		// // if we're here is because user has clicked on the notification
		// // and we set extras in the intent 
		// // and the app WAS RUNNING (=> RESUMED)
		// // (again don't worry, we'll see more of this later)
		// Ti.API.info('******* data (resumed) ' + JSON.stringify(data));
		// alert('******* data (resumed) ' + JSON.stringify(data));
	// }
// });

