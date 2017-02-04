exports.getPushNotification = function(params) {
	var notificationParams = {
		types : [Titanium.Network.NOTIFICATION_TYPE_BADGE, Titanium.Network.NOTIFICATION_TYPE_ALERT, Titanium.Network.NOTIFICATION_TYPE_SOUND],
		success : function(ev) {
			Ti.API.info('******* success, ' + ev.deviceToken);
			params.success(ev.deviceToken);
			Ti.App.Properties.setBool("RegisteredGCM",true);
			Alloy.Globals.setData("deviceId", ev.deviceToken);
		},
		error : function(ev) {
			params.error(ev.error);
		},
		callback : function(e) {
			params.callback(e);
		},
		unregister : function(ev) {
			if (params.unregister) {
				params.unregister(ev.deviceToken);
			}
		},
		data : function(data) {
			if (params.data) {
				params.data(data);
			}
		},
	};
	function registerForPush() {
		delete notificationParams.types;
		Ti.Network.registerForPushNotifications(notificationParams);
		// Remove event listener once registered for push notifications
		Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
	};

	if (Ti.Platform.osname === "android") {
		var gcm = require('net.iamyellow.gcmjs');
		var isRegisteredGCM = Ti.App.Properties.getBool("RegisteredGCM");
		if (isRegisteredGCM == true){
			return;
		}
		var pendingData = gcm.data;
		if (pendingData && pendingData !== null) {
			// if we're here is because user has clicked on the notification
			// and we set extras for the intent
			// and the app WAS NOT running
			// (don't worry, we'll see more of this later)
			Ti.API.error('******* data (started) ' + JSON.stringify(pendingData));
			if (params.data) {
				params.data(pendingData);
			}
			gcm.data = null;
		}
		gcm.registerForPushNotifications(notificationParams);
	} else {

		// iOS8 and above new push requirements handler

		if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
			Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);

			// Register notification types to use
			Ti.App.iOS.registerUserNotificationSettings({
				types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
			});

		} else
			Ti.Network.registerForPushNotifications(notificationParams);
	}
};
