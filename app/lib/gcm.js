(function(service) {

	var serviceIntent = service.getIntent(),
	    title = serviceIntent.hasExtra('title') ? serviceIntent.getStringExtra('title') : '',
	    statusBarMessage = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '',
	    message = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '',
	    type = serviceIntent.hasExtra('type') ? serviceIntent.getStringExtra('type') : '',
	    order = serviceIntent.hasExtra('order') ? serviceIntent.getStringExtra('order') : '',
	    status = serviceIntent.hasExtra('status') ? serviceIntent.getStringExtra('status') : '',

	    notificationId = (function() {
		// android notifications ids are int32
		// java int32 max value is 2.147.483.647, so we cannot use javascript millis timpestamp
		// let's make a valid timed based id:

		// - we're going to use hhmmssDYLX where (DYL=DaysYearLeft, and X=0-9 rounded millis)
		// - hh always from 00 to 11
		// - DYL * 2 when hour is pm
		// - after all, its max value is 1.159.597.289

		var str = '',
		    now = new Date();

		var hours = now.getHours(),
		    minutes = now.getMinutes(),
		    seconds = now.getSeconds();
		str += (hours > 11 ? hours - 12 : hours) + '';
		str += minutes + '';
		str += seconds + '';

		var start = new Date(now.getFullYear(), 0, 0),
		    diff = now - start,
		    oneDay = 1000 * 60 * 60 * 24,
		    day = Math.floor(diff / oneDay);
		// day has remaining days til end of the year
		str += day * (hours > 11 ? 2 : 1);

		var ml = (now.getMilliseconds() / 100) | 0;
		str += ml;

		return str | 0;
	})();
	Ti.API.info("*****************GCM service*************** " + title + " " + message);
	// create launcher intent
	var ntfId = Ti.App.Properties.getInt('ntfId', 0),
	    launcherIntent = Ti.Android.createIntent({
		className : 'net.iamyellow.gcmjs.GcmjsActivity',
		action : 'action' + ntfId, // we need an action identifier to be able to track click on notifications
		packageName : Ti.App.id,
		flags : Ti.Android.FLAG_ACTIVITY_NEW_TASK | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
	});
	launcherIntent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
	launcherIntent.putExtra("ntfId", ntfId);
	launcherIntent.putExtra("title", title);
	launcherIntent.putExtra("message", message);
	launcherIntent.putExtra("type", type);
	launcherIntent.putExtra("order", order);
	launcherIntent.putExtra("status", status);

	// increase notification id
	ntfId += 1;
	Ti.App.Properties.setInt('ntfId', ntfId);

	function format_time() {
		// formats a javascript Date object into a 12h AM/PM time string

		var date_obj = new Date();
		var hour = date_obj.getHours();
		var minute = date_obj.getMinutes();
		var amPM = (hour > 11) ? "pm" : "am";
		if (hour > 12) {
			hour -= 12;
		} else if (hour == 0) {
			hour = "12";
		}
		if (minute < 10) {
			minute = "0" + minute;
		}
		return hour + ":" + minute + " " + amPM;
	}

	// Created custom view for other that Check-in notifications
	function getCustomNotificationView() {
		var customView = Ti.Android.createRemoteViews({
			layoutId : Ti.App.Android.R.layout.customview
		});
		customView.setTextViewText(Ti.App.Android.R.id.title, title);
		customView.setTextViewText(Ti.App.Android.R.id.message, message);
		customView.setTextViewText(Ti.App.Android.R.id.time, format_time());
		return customView;
	}


	Ti.API.info("***************ORDER_ACCEPTED_STATUS*************** " + type + " " + status);
	if (type == "ORDER_ACCEPTED_STATUS") {
		(status == "true") ? require("notificationCallBack").getOtpAndCheckoutIdFromServer() : false;
	}

	// create notification
	var pintent = Ti.Android.createPendingIntent({
		intent : launcherIntent
	});
	var args = {
		contentView : getCustomNotificationView(),
		contentIntent : pintent,
		//contentTitle: title,
		//contentText: message,
		tickerText : statusBarMessage,
		icon : Ti.App.Android.R.drawable.appicon,
		flags : Ti.Android.FLAG_AUTO_CANCEL | Ti.Android.FLAG_SHOW_LIGHTS,
		defaults : Titanium.Android.NotificationManager.DEFAULT_VIBRATE | Titanium.Android.NotificationManager.DEFAULT_SOUND,
		when : new Date()
	};

	var notification = Ti.Android.createNotification(args);

	Ti.Android.NotificationManager.notify(notificationId, notification);

	service.stop();

})(Ti.Android.currentService);
