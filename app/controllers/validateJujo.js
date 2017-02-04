$.backMenuIconView.addEventListener("click", function() {
	$.validateJujo.close();
});

$.activityIndicator.show();

var Barcode = Alloy.Globals.BarCode;

Barcode.allowRotation = false;
Barcode.displayedMessage = ' ';
Barcode.allowMenu = false;
Barcode.allowInstructions = false;
Barcode.useLED = false;

var overlay = Ti.UI.createView({
	backgroundColor : 'transparent',
	top : Alloy.Globals.navigatorHeight,
	right : 0,
	bottom : Alloy.Globals.bottomNavigatorHeight,
	left : 0
});

var validating = false;
Barcode.addEventListener('success', function(e) {
	Ti.API.info("*******************Barcode******listener************** " + JSON.stringify(e));
	$.validateJujo.close();
	Barcode.cancel();
	alert(e.result);
	return;
	if (!validating) {
		validating = true;
		Barcode.cancel();
		var userid = e.result;
		//Ti.API.info("Jujo for " + userid);
		console.log(Alloy.Globals.currentUser.custom_fields);
		if (Alloy.Globals.currentUser.custom_fields.jujo == undefined) {
			Alloy.Globals.currentUser.custom_fields.jujo = {};
			Alloy.Globals.currentUser.custom_fields.jujo[userid] = 0;
			Alloy.Globals.currentUser.custom_fields.customer_status = {};
			Alloy.Globals.currentUser.custom_fields.customer_status.total_customers = 1;
			//starts with the first customer
			Alloy.Globals.currentUser.custom_fields.customer_status.returned_customers = 0;
			//this is his first visit
			Alloy.Globals.currentUser.custom_fields.return_percentage = 0;
		} else {
			if (Alloy.Globals.currentUser.custom_fields.jujo[userid] == undefined) {
				Alloy.Globals.currentUser.custom_fields.jujo[userid] = -1;
				Alloy.Globals.currentUser.custom_fields.customer_status.total_customers++;
				//if he never been here add 1 to total
			} else if (Alloy.Globals.currentUser.custom_fields.jujo[userid] == 1) {
				Alloy.Globals.currentUser.custom_fields.customer_status.returned_customers++;
				//if he has been here add 1 to returning
			}
		}

		//Ti.API.info("Current Jujo " + currentJujo);
		Alloy.Globals.currentUser.custom_fields.jujo[userid]++;
		//Ti.API.info("Request Jujo " + Alloy.Globals.currentUser.custom_fields.jujo[userid]);
		//Return customers update:
		Alloy.Globals.currentUser.custom_fields.return_percentage = parseInt((Alloy.Globals.currentUser.custom_fields.customer_status.returned_customers / Alloy.Globals.currentUser.custom_fields.customer_status.total_customers) * 100);

		var reward = applyReward(Alloy.Globals.currentUser.custom_fields.jujo[userid]);

		if (reward) {
			if (Alloy.Globals.currentUser.custom_fields.jujo[reward] == undefined) {
				Alloy.Globals.currentUser.custom_fields.jujo[reward] = 0;
			}

			Alloy.Globals.currentUser.custom_fields.jujo[reward]++;

			var previousReward = parseInt(reward) - 1;
			if (previousReward == 0 || previousReward == 1) {
				Alloy.Globals.currentUser.custom_fields.jujo[previousReward.toString()]--;
			}
		}

		Alloy.Globals.Cloud.Users.update({
			id : Alloy.Globals.currentUser.id,
			custom_fields : {
				jujo : Alloy.Globals.currentUser.custom_fields.jujo,
				return_percentage : Alloy.Globals.currentUser.custom_fields.return_percentage,
				customer_status : Alloy.Globals.currentUser.custom_fields.customer_status
			}
		}, function(e) {
			var callbackOk = function() {
				capture();
			};
			var callbackCancel = function() {
				$.validateJujo.close();
			};
			if (e.success) {
				//Ti.API.info(JSON.stringify(e));

				var message = L("jujoValidated");
				if (reward == "2") {
					message = L("jujoValidatedGold") + " \n\n\n" + message;
				} else if (reward == "1") {
					message = L("jujoValidatedSilver") + " \n\n\n" + message;
				} else if (reward == "0") {
					message = L("jujoValidatedBronze") + " \n\n\n" + message;
				}

				Alloy.Globals.simpleAlert(message, callbackOk, callbackCancel);

				var userMessage = L("jujoValidatedUser");
				if (reward == "2") {
					userMessage = L("jujoValidatedGoldUser");
				} else if (reward == "1") {
					userMessage = L("jujoValidatedSilverUser");
				} else if (reward == "0") {
					userMessage = L("jujoValidatedBronzeUser");
				}
				Alloy.Globals.Cloud.PushNotifications.notify({
					channel : 'global',
					to_ids : userid,
					payload : userMessage
				}, function(e) {
					if (e.success) {
						//alert('Success');
					} else {
						//Ti.API.info('Error:\n' +
						//    ((e.error && e.message) || JSON.stringify(e)));
					}
				});

				validating = false;
			} else {
				//Ti.API.info('Error:\n' +
				//		((e.error && e.message) || JSON.stringify(e)));
				Alloy.Globals.simpleAlert(L("jujoNotValidated"), callbackOk, callbackCancel);
				validating = false;
			}
		});
	}
});

Barcode.addEventListener('error', function(e) {
	Ti.API.info("*******************Barcode**error****listener************** " + JSON.stringify(e));
	$.validateJujo.close();
	Barcode.cancel();
});

function applyReward(jujo) {
	if (jujo == Alloy.Globals.bronzeJujo) {
		return "0";
	} else if (jujo == Alloy.Globals.silverJujo) {
		return "1";
	} else if (jujo == Alloy.Globals.goldJujo) {
		return "2";
	}
	return undefined;
}

var cancelButton = $.UI.create("ImageView", {
	image : "/images/exit2.png",
	height : 48,
	width : 48,
	left : Alloy.Globals.navigatorIconPadding,
	top : Alloy.Globals.navigatorIconPadding
});

cancelButton.addEventListener('click', function() {
	$.validateJujo.close();
	Barcode.cancel();
});

overlay.add(cancelButton);

function capture(args) {
	Barcode.capture({
		animate : false,
		overlay : overlay,
		showCancel : false,
		showRectangle : true,
		keepOpen : true,
		acceptedFormats : [Barcode.FORMAT_QR_CODE],
	});
}

$.validateJujo.addEventListener("open", function() {
	capture();
});
