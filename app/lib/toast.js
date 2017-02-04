exports.show = function(params) {
	params = params || {};

	if (OS_ANDROID) {
		var toast = Ti.UI.createNotification({
			message : params.message || "MESSAGE",
			duration : params.duration || Titanium.UI.NOTIFICATION_DURATION_SHORT,
			xOffset : 50,
			yOffset : 50,
			//gravity : 20 | 4
		});
		toast.show();
		return;
	}
	var win = Ti.UI.createWindow({
		backgroundColor : "transparent",
		//statusBarStyle : Ti.UI.iPhone.StatusBar.LIGHT_CONTENT,
		height : Ti.UI.FILL,
		touchEnabled : false
	});
	if (OS_IOS) {
		win.statusBarStyle = Ti.UI.iPhone.StatusBar.LIGHT_CONTENT;
	}
	var mainView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : 280,
		opacity : 0,
		//backgrounColor : "green"
	});
	var backgroundView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		borderRadius : 7,
		borderColor : "#808080",
		boderWidth : 4,
		//backgroundImage : "images/transparent_black.png",
		backgroundColor : "#000",
		opacity : 0.6,
	});
	var messageLabel = Ti.UI.createLabel({
		text : params.message || "MESSAGE",
		color : "#FFF",
		font : {
			fontSize : 16,
			fontFamily : "OpenSans-Regular"
		},
		textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
		top : 10,
		bottom : 10,
		left : 10,
		right : 10,
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
	});
	backgroundView.add(messageLabel);
	mainView.add(backgroundView);
	win.add(mainView);
	var duration = params.duration || 2000;
	var hide = function() {
		_.delay(function() {
			mainView.animate({
				opacity : 0,
				duration : 500,
			}, function() {
				win.close();
			});
		}, duration);
	};
	win.open();

	mainView.animate({
		opacity : 1,
		duration : 500,
	}, hide);

};
