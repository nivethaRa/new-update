if ( typeof Alloy === 'undefined') {
	Alloy = require('alloy');
}
if ( typeof _ === 'undefined') {
	_ = require('alloy/underscore')._;
}
if ( typeof moment === 'undefined') {
	moment = require('alloy/moment');

	var inBackground = false;
}

var SFEZKeys = require("SFEZKeys");

function showAcceptOrderDialog(title, message, order_id) {
	var dialog = Ti.UI.createAlertDialog({
		title : title,
		message : message,
		buttonNames : ['Accept', 'Decline']
	});
	var params = {
		order : order_id
	};
	dialog.addEventListener('click', function(e) {
		Alloy.Globals.loading.show(L("Please wait..."), false);
		if (e.index === 0) {
			params['status'] = true;
		} else {
			params['status'] = false;
		}
		Alloy.Globals.Services.Vendor.acceptOrder(params, function() {
			Alloy.Globals.loading.hide();
			var msg = (params['status'] == true) ? "Order Accepted" : "Order Declined";
			alert(msg);
		});
	});
	dialog.show();
}

function makeDummyPaymentToMoltin(success) {
	Ti.API.info("*****************makeDummyPaymentToMoltin********************* " + Alloy.Globals.getData(SFEZKeys.KEYS.CONSUMER_CARD_DETAIL).orderId);
	var cardNum = success ? '4242424242424242' : '4242424242424243';
	var params = {
		orderId : Alloy.Globals.getData(SFEZKeys.KEYS.CONSUMER_CARD_DETAIL).orderId,
		requestData : {
			"data[first_name]" : 'Sapna',
			"data[last_name]" : 'Sharma',
			"data[number]" : cardNum,
			"data[expiry_month]" : '08',
			"data[expiry_year]" : '2020',
			"data[cvv]" : '123'
		}
	};
	Alloy.Globals.Services.Consumer.makeDummyPaymentToMoltin(params);
}

function makePaymentToSumUp(_resp) {
	var cardDetail = Alloy.Globals.getData(SFEZKeys.KEYS.CONSUMER_CARD_DETAIL);
	var params = {
		"checkoutId" : _resp.checkoutId,
		"otp" : _resp.otp,
		requestData : {
			"payment_type" : "card",
			"card" : {
				"cvv" : cardDetail.cvv,
				"expiry_month" : cardDetail.month.split("(")[0],
				"expiry_year" : cardDetail.year,
				"number" : cardDetail.cardNum,
				"name" : cardDetail.cardHolderName
			}
		}
	};
	Alloy.Globals.Services.Consumer.makePaymentToSumUp(params, function(resp) {
		Alloy.Globals.loading.hide();
		alert("Payment processed");
		makeDummyPaymentToMoltin(true);
	}, function() {
		alert("Payment not processed");
		makeDummyPaymentToMoltin(false);
	});
}

exports.getOtpAndCheckoutIdFromServer = function() {
	Ti.API.info("**************getOtpAndCheckoutIdFromServer************");
	Alloy.Globals.loading.show(L("Please wait..."), false);
	var params = {
		"amount" : Alloy.Globals.getData(SFEZKeys.KEYS.CONSUMER_CARD_DETAIL).amount,
		"currency" : "BRL",
		"pay_to_email" : "streetfoodez@sumup.com"
	};
	Alloy.Globals.Services.Consumer.getSumUpCheckoutId(params, function(resp) {
		makePaymentToSumUp(resp);
	});
};

function showAlertDialog(title, message, _isOrderAcceptanceStatus, orderAcceptanceValue) {
	Ti.API.info("*******************showAlertDialog*************** " + _isOrderAcceptanceStatus + " " + orderAcceptanceValue);
	var dialog = Ti.UI.createAlertDialog({
		title : title,
		message : message,
		buttonNames : ['OK']
	});
	dialog.addEventListener('click', function(e) {
		//if order acceptance notification
		if (_isOrderAcceptanceStatus) {
			//if order accepted proceed to make payment
			(orderAcceptanceValue == "true") ? exports.getOtpAndCheckoutIdFromServer() : false;
		}
	});
	dialog.show();
}

exports.notificationCallBack = function(e) {
	Ti.API.warn(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>NOTIFICATION ARRIVES >>>>>>>>>>>>>>>>>>>>>>>> \n", +JSON.stringify(e));
	Ti.API.info(JSON.stringify(e));
	inBackground = e.inBackground || false;
	Ti.API.info("****************notificationCallBack****************** " + e.status);

	if (inBackground) {
		Alloy.createController('navigationDrawerContent/home').getView().open();

		if (e.type == "ORDER_CREATED") {
			showAcceptOrderDialog(e.title, e.message, e.order);
		} else {
			var isOrderAcceptanceStatus = (e.type == "ORDER_ACCEPTED_STATUS") ? true : false;
			showAlertDialog(e.title, e.message, isOrderAcceptanceStatus, e.status);
		}

	} else {
		if (e.type == "ORDER_CREATED") {
			showAcceptOrderDialog(e.title, e.message, e.order);
		} else {
			var isOrderAcceptanceStatus = (e.type == "ORDER_ACCEPTED_STATUS") ? true : false;
			showAlertDialog(e.title, e.message, isOrderAcceptanceStatus, e.status);
		}
	}
};

