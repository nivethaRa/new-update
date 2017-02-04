var args = arguments[0] || {};

(OS_IOS) ? ($.win.title = args.vendorName) : ($.winTitle.text = args.vendorName);

var moment = require('alloy/moment'),
    SFEZKeys = require("SFEZKeys");
var addProductToCartQueue = new ( require('addProductToCartQueue'));
var currentDate = new Date();
var deliveryType = 0;
var closedTime = new Date();
var deliveryCharge = args.deliveryCharge;
var delivery_charge_item_id = args.delivery_charge_item_id;
closedTime.setHours(20, 0, 0, 0);
var diiMill = (closedTime.getTime() - currentDate.getTime());
var customerOrderWindowSetting = 30;
var totalAmount,
    subTotalValueLabel,
    finalPriceValueLabel,
    orderId,
    bottomView,
    placeOrderBtn;
var selectedMenuItems = args.selectedItems;
Ti.API.info("All Itemssss@@@ "+JSON.stringify(selectedMenuItems));
var pickupRadioButton,
    deliveryRadioButton,
    expandedView;

$.myCartWin.addEventListener('open', function(evt) {
	if (OS_ANDROID) {
		var actionBar = evt.source.activity.actionBar;
		if (actionBar) {
			actionBar.displayHomeAsUp = true;
			actionBar.icon = "/images/back.png";
			actionBar.backgroundImage = "/images/topBar.png";
			actionBar.title = "My Cart";

			actionBar.onHomeIconItemSelected = function(e) {
				$.myCartWin.close();
			};
		}
	}
});

function closeWindow() {
	args.callback(selectedMenuItems);
	$.getView().close();
}
function getAmount(a, b) {
	return (((a + b) * 10) / 10).toFixed(2);
}

function getTotalAmount(a, b , c) {
	return (((a + b+ c) * 10) / 10).toFixed(2);
}

function totalProductPrice(price, quantity) {
	return (((price.split('$')[1] * quantity) * 10) / 10).toFixed(2);
}

//multiple of five
function getDefaultPickupTime(date, minutes) {
	var d = new Date(date.getTime() + minutes * 60000);
	if (d.getMinutes() % 5 != 0) {
		var minute = Math.ceil(d.getMinutes() / 5) * 5;
		d.setMinutes(0);
		d = new Date(d.getTime() + minute * 60000);
	}
	return moment(d).format("h:mm  a");
}

function addSliderView() {
	expandedView.removeAllChildren();

	var pickUpTimeView = Ti.UI.createView({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		layout : 'horizontal',
		left : 0,
	});

	var pickUpTimeLabel = Ti.UI.createLabel({
		text : "Pickup Time:",
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	var pickUpTimeValue = Ti.UI.createLabel({
		left : 8,
		text : getDefaultPickupTime(currentDate, customerOrderWindowSetting),
		font : {
			fontSize : 15,
			fontWeight : "bold",
			fontFamily : 'Raleway-Bold',
		},
		color : "#000",
	});

	pickUpTimeView.add(pickUpTimeLabel);
	pickUpTimeView.add(pickUpTimeValue);

	expandedView.add(pickUpTimeView);

	var slider = Titanium.UI.createSlider({
		top : 10,
		min : 0,
		max : Math.round(diiMill / (1000 * 60)),
		width : '100%',
		value : 0,
		left : 0,
		right : 0,
	});

	expandedView.add(slider);

	slider.addEventListener('change', function(e) {
		//label.text = String.format("%3.1f", e.value);
		var temp = customerOrderWindowSetting + Math.round(e.value);
		pickUpTimeValue.text = getDefaultPickupTime(currentDate, temp);
	});

	var nowAndClosetImeView = Ti.UI.createView({
		top : 10,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
	});

	var nowLabel = Ti.UI.createLabel({
		left : 0,
		text : "Now: " + moment(currentDate).format("h:mm  a"),
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});
	var closedLabel = Ti.UI.createLabel({
		right : 0,
		text : "Closing Time:  8:00 pm",
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});
	nowAndClosetImeView.add(nowLabel);
	nowAndClosetImeView.add(closedLabel);
	expandedView.add(nowAndClosetImeView);
}

function addLocationAndContactView() {
	expandedView.removeAllChildren();

	var deliveryLocationLabel = Ti.UI.createLabel({
		text : "Delivery Location:",
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
		left : 0
	});

	var streetField = $.UI.create('View', {
		classes : ["textFieldViewContainer"]
	});
	var street = $.UI.create('TextField', {
		hintText : 'Street Address',
		classes : ["textFieldContainer"]
	});
	streetField.add(street);

	var aptField = $.UI.create('View', {
		classes : ["textFieldViewContainer"]
	});
	var apt = $.UI.create('TextField', {
		hintText : 'Apt/Suite',
		classes : ["textFieldContainer"]
	});
	aptField.add(apt);

	var zipField = $.UI.create('View', {
		classes : ["textFieldViewContainer"],
		width : "75%",
		left : 0
	});
	var zip = $.UI.create('TextField', {
		hintText : 'Zip/Postal Code',
		classes : ["textFieldContainer"]
	});
	zipField.add(zip);

	var phoneLabel = Ti.UI.createLabel({
		top : 10,
		text : "Phone:",
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
		left : 0
	});

	var phoneField = $.UI.create('View', {
		classes : ["textFieldViewContainer"]
	});
	var phone = $.UI.create('TextField', {
		hintText : 'Phone Number',
		classes : ["textFieldContainer"],
		keyboardType : Titanium.UI.KEYBOARD_TYPE_PHONE_PAD
	});
	phoneField.add(phone);

	expandedView.add(deliveryLocationLabel);
	expandedView.add(streetField);
	expandedView.add(aptField);
	expandedView.add(zipField);
	expandedView.add(phoneLabel);
	expandedView.add(phoneField);
}

function onPicupRadioButton() {
	deliveryRadioButton.image = "/images/radio_off.png";
	pickupRadioButton.image = "/images/radio_on.png";
	deliveryType = 0;
	refreshMyOrder();
	addSliderView();
}

function onDeliveryRadioButton() {
	pickupRadioButton.image = "/images/radio_off.png";
	deliveryRadioButton.image = "/images/radio_on.png";
	deliveryType = 1;
	refreshMyOrder();
	addLocationAndContactView();
	
}

function refreshMyOrder() {
	bottomView.removeAllChildren();
	$.selectedMenuItemList.sections[0].setItems([]);
	createMyOrder();
}

function getLeftAmount(a, b) {
	return (((a - b) * 10) / 10).toFixed(2);
}

function updateSubTotalAndTotalPrice(priceToBeDeducted) {
	subTotalValueLabel.text = 'R$' + getLeftAmount(Number(subTotalValueLabel.getText().split('$')[1]), Number(priceToBeDeducted));
	finalPriceValueLabel.text = 'R$' + getLeftAmount(Number(finalPriceValueLabel.getText().split('$')[1]), Number(priceToBeDeducted));
}

function sendOrderCreationConfirmationToServer() {
	var params = {
		"vendor" : "pankaj.kumar@oodlestechnologies.com",
		"order" : orderId,
	};
	Alloy.Globals.Services.Consumer.sendOrderCreationConfirmation(params, function() {
		Alloy.Globals.loading.hide();
		alert("Order Placed Successfully");
	});
}

function convertCartToOrder() {

	var params = {
		requestData : {
			"customer[first_name]" : "Matt",
			"customer[last_name]" : "Guiger",
			"customer[email]" : "Matt.Guiger@mgmail.com",
			"shipping" : "free-shipping",
			"gateway" : "dummy",
			"bill_to[first_name]" : "Sapna",
			"bill_to[last_name]" : "Sharma",
			"bill_to[address_1]" : "RZ-32",
			"bill_to[city]" : "New Delhi",
			"bill_to[county]" : "US",
			"bill_to[country]" : "US",
			"bill_to[postcode]" : "110001",
			"ship_to" : "bill_to"
		},
		cartId : args.cartId
	};
	Alloy.Globals.Services.Consumer.cartToOrder(params, function(resp) {
		if (!resp) {
			return;
		}
		Ti.API.info("FINALCART--->" + JSON.stringify(resp));
		orderId = resp.id;
		var cardData = Alloy.Globals.getData(SFEZKeys.KEYS.CONSUMER_CARD_DETAIL);
		cardData["orderId"] = orderId;
		Alloy.Globals.setData(SFEZKeys.KEYS.CONSUMER_CARD_DETAIL, cardData);
		sendOrderCreationConfirmationToServer();
		//getOtpAndCheckoutIdFromServer();
	});
}

var goToPaymentWin = function() {
	Ti.API.info("**************placeOrderBtn*****clicked*************");
	Alloy.createController('paymentWindow', {
		amount : totalAmount,
		callback : function() {
			addProductToCartQueue.init("addProductToCart");
			_.each(selectedMenuItems, function(item, index) {
				addProductToCartQueue.add(item, args.cartId, convertCartToOrder);
			});
			addProductToCartQueue.start();
		}
	}).getView().open();
};

var payInPerson = function() {
	//TODO make payment once order has been accepted by vendor
	require('com.oodles.sumupuricall').gotoSumUP({
		success : function(e) {
			alert("Payment Success");
		},
		error : function(e) {
			alert("Payment Error");
		},
		affiliateKey : "6332ad54-eb47-4b41-8390-074f062da085",
		appId : "com.sumup.apisampleapp",
		amount : totalAmount,
		currency : "BRL",
		title : "SFEZ",
		mobile : "+558481534031",
		email : "streetfoodez@sumup.com"
	});
};

function createMyOrder() {

	var subTotal = 0;
	var newData = [];
	var singleOptionTotal = 0;
	var multipleOptionTotal = 0;

	
	for (var i = 0; i < selectedMenuItems.length; i++) {
		Ti.API.info("!!!!!!!!!@@@@@@@@@@@ Final creation table data" +i+"^^^^" +JSON.stringify(selectedMenuItems[i]));
		var ithProductTotalPrice = totalProductPrice(selectedMenuItems[i].price, selectedMenuItems[i].quantity);
		subTotal = getAmount(Number(subTotal), Number(ithProductTotalPrice));
		Ti.API.info( selectedMenuItems[i].price+"---"+selectedMenuItems[i].quantity+"---"+ithProductTotalPrice +"---"+subTotal);
		var extra_str = "";
		var options_str = "";
		if (selectedMenuItems[i].selectedModifiers) {
			 singleOptionTotal = 0;
			 multipleOptionTotal = 0;
			var multiple = selectedMenuItems[i].selectedModifiers.multiple;
			if(multiple){
				for (var m = 0; m < multiple.length; m++) {
					var keys = Object.keys(multiple[m]);
					var value = multiple[m][keys];
	
					for (var j = 0; j < selectedMenuItems[i].modifiers.length; j++) {
						var variations = selectedMenuItems[i].modifiers[j][keys].variations;
						if (options_str != "") {
							options_str = options_str + ", " + variations[value].title+"("+variations[value].difference+")";
						} else {
							options_str = "Extras: "+variations[value].title+"("+variations[value].difference+")";
						}
						var valAmount = variations[value].mod_price.substring(1);
						multipleOptionTotal += Number(valAmount);
					}
				}
			}
			var single = selectedMenuItems[i].selectedModifiers.single;
			if(single){
				for (var m = 0; m < single.length; m++) {
					//Ti.API.info(JSON.stringify(multiple[i]));
					var keys = Object.keys(single[m]);
					//alert(keys);
					var value = single[m][keys];
					for (var j = 0; j < selectedMenuItems[i].modifiers.length; j++) {
						var variations = selectedMenuItems[i].modifiers[j][keys].variations;
						if (extra_str != "") {
							extra_str = extra_str + ", " + selectedMenuItems[i].modifiers[j][keys].title + ": " +variations[value].title+"("+variations[value].difference+")";
						} else {
							extra_str = selectedMenuItems[i].modifiers[j][keys].title + ": " + variations[value].title +"("+variations[value].difference+")";
						}
						var valAmount = variations[value].mod_price.substring(1);
						singleOptionTotal += Number(valAmount);
					}
				}
			}
			ithProductTotalPrice = (((Number(ithProductTotalPrice)+(Number(singleOptionTotal + multipleOptionTotal))*selectedMenuItems[i].quantity) * 10) / 10).toFixed(2);
			/*subTotal = getAmount(Number(ithProductTotalPrice), Number("0.0"));*/
			/*Ti.API.info(subTotal + "SUBTOTAL^^^^^^ithProductTotalPrice"+ ithProductTotalPrice);*/
			subTotal = getAmount(Number(subTotal),(Number(singleOptionTotal + multipleOptionTotal)*selectedMenuItems[i].quantity));
		} else {
			Ti.API.info("not aval");
		}
		
		
	var descLbl = "";
	if(options_str!= ""){
		descLbl = descLbl + options_str;
		if(extra_str != ""){
			descLbl = descLbl + "\n"+ extra_str;
		}
	}
	else if(extra_str != ""){
			descLbl = descLbl + extra_str;
		}
		 
		
		var listData = {
			baseView : {
				productId : selectedMenuItems[i].productId,
				modifiers : selectedMenuItems[i].modifiers, 
				description : selectedMenuItems[i].description
			},
			quantitylbl : {
				text : selectedMenuItems[i].quantity
			},
			titlelbl : {
				text : " x " + selectedMenuItems[i].name
			},
			desclbl : {
				height : descLbl == "" ?0:Ti.UI.SIZE,
				visible : descLbl == "" ?false: true,
				text:descLbl,
			},
			pricelbl : {
				text : 'R$' + ithProductTotalPrice
			},
			beefLbl : {
				//height : (i != 0) ? 0 : Ti.UI.SIZE,
				//visible : (i != 0) ? false : true
				height : 0,
				visible : false
			},
			beefPricelbl : {
				//height : (i != 0) ? 0 : Ti.UI.SIZE,
				//visible : (i != 0) ? false : true
				height : 0,
				visible : false
			}
		};
		newData.push(listData);
	}

	if (!_.isUndefined($.selectedMenuItemList.sections[0])) {
		$.selectedMenuItemList.sections[0].appendItems(newData);
	}

	bottomView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		layout : "vertical"
	});

	var sap = Ti.UI.createView({
		height : 3,
		width : Titanium.UI.FILL,
		top : 10,
		backgroundColor : "#CACACA"
	});
	bottomView.add(sap);

	var priceSection = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Titanium.UI.FILL,
		top : 0,
		// layout:"vertical"
	});
	bottomView.add(priceSection);

	var subTotalLbl = Ti.UI.createLabel({
		left : 40,
		right : 100,
		top : 10,
		text : L('MyOrderSubtotal'),
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	priceSection.add(subTotalLbl);
	//subTotal = subTotal;
	// + getTotalAmount(Number(subTotal), Number(0));
	subTotalValueLabel = Ti.UI.createLabel({
		right : 40,
		top : 10,
		text : 'R$' + subTotal,
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	priceSection.add(subTotalValueLabel);
	
	//Service Charge
	var serviceLbl = Ti.UI.createLabel({
		left : 40,
		top : 40,
		text : "Service Charge",
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	priceSection.add(serviceLbl);

	var servicePriceLbl = Ti.UI.createLabel({
		right : 40,
		top : 40,
		text : "R$1.60",
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	priceSection.add(servicePriceLbl);
	
	if(deliveryType == 1) {
		var deliveryLbl = Ti.UI.createLabel({
			left : 40,
			right : 100,
			top : 70,
			text : "Delivery Charge",
			font : {
				fontSize : 15,
				fontFamily : 'Lucida Grande',
			},
			color : "#000",
		});
		priceSection.add(deliveryLbl);
		
		var deliveryPriceLbl = Ti.UI.createLabel({
	 		right : 40,
			top : 70,
			text : "R$"+deliveryCharge,
			font : {
				fontSize : 15,
				fontFamily : 'Lucida Grande',
			},
			color : "#000",
		});
		priceSection.add(deliveryPriceLbl);
    }

	var sap = Ti.UI.createView({
		height : 2,
		width : Titanium.UI.FILL,
		top : 10,
		backgroundColor : "#CACACA"
	});
	bottomView.add(sap);

	var totalCountView = Ti.UI.createView({
		height : 30,
		width : Titanium.UI.FILL,
		top : 0,
		// layout:"horizontal"
	});
	bottomView.add(totalCountView);

	//TOTAL Price
	var finalPriceLbl = Ti.UI.createLabel({
		left : 40,
		top : 10,
		text : L('MyOrderTotal'),
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	totalCountView.add(finalPriceLbl);
	if(deliveryType == 0 ) {
		totalAmount = getTotalAmount(Number(subTotal), Number(("1.60")), Number(("0.00")));
	}else {
		totalAmount = getTotalAmount(Number(subTotal), Number(("1.60")), Number((deliveryCharge)));
	}
	finalPriceValueLabel = Ti.UI.createLabel({
		right : 40,
		top : 10,
		text : 'R$' + totalAmount,
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});


	totalCountView.add(finalPriceValueLabel);

	var sap = Ti.UI.createView({
		height : 2,
		width : Titanium.UI.FILL,
		top : 10,
		backgroundColor : "#CACACA"
	});
	bottomView.add(sap);

	var pickupView = $.UI.create('View', {
		top : 20,
		classes : ["heightSize"],
		left : 40,
		layout : "horizontal"
	});

	pickupRadioButton = $.UI.create('ImageView', {
		classes : ["radioBtn"],
	});

	var pickupLabel = $.UI.create('Label', {
		text : "Pickup",
		left : 20,
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	pickupView.add(pickupRadioButton);
	pickupView.add(pickupLabel);

	bottomView.add(pickupView);

	var deliveryView = $.UI.create('View', {
		top : 10,
		classes : ["heightSize"],
		left : 40,
		layout : "horizontal"
	});

	deliveryRadioButton = $.UI.create('ImageView', {
		classes : ["radioBtn"],
	});

	var deliveryLabel = $.UI.create('Label', {
		text : "Delivery",
		left : 20,
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	var deliveryChargeLabel = $.UI.create('Label', {
		text : "(Extra delivery charge)",
		left : 2,
		font : {
			fontSize : 10,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	deliveryView.add(deliveryRadioButton);
	deliveryView.add(deliveryLabel);
	deliveryView.add(deliveryChargeLabel);

	bottomView.add(deliveryView);

	expandedView = $.UI.create('View', {
		top : 20,
		left : 40,
		right : 40,
		layout : "vertical",
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
	});

	bottomView.add(expandedView);

	var payView = Ti.UI.createView({
		top : 20,
		height : Ti.UI.SIZE,
		left : 40,
		right : 40
	});
	placeOrderBtn = $.UI.create('Button', {
		//left : 0,
		title : L('MyOrderPlaceOrder'),
		classes : ["searchLocation"],
		width : 120,
		borderRadius : 3,
	});
	var payInPersonBtn = $.UI.create('Button', {
		right : 0,
		title : "Pay in Person",
		classes : ["searchLocation"],
		width : 120,
		borderRadius : 3,
	});
	payView.add(placeOrderBtn);
	//payView.add(payInPersonBtn); comented by moiz as need it to be hidden as per requirement
	bottomView.add(payView);

	var placeOrderView = $.UI.create('View', {
		top : 0,
		classes : ["heightSize"],
	});
	bottomView.add(placeOrderView);

	$.myCartTable.add(bottomView);

	var placeOrderImgView = $.UI.create('ImageView', {
		classes : ["menuImg"],
	});
	placeOrderView.add(placeOrderImgView);

	var addToOrderLbl = $.UI.create('Label', {
		top : 100,
		classes : ["menuorderLbl"],
		text : L("add_to_order"),
	});

	placeOrderView.add(addToOrderLbl);

	addToOrderLbl.addEventListener('click', function() {
		closeWindow();
	});
	/*onPicupRadioButton();*/
	if(deliveryType == 0){
		addSliderView();
		pickupRadioButton.image = "/images/radio_on.png";
		deliveryRadioButton.image = "/images/radio_off.png";
	}else{
		pickupRadioButton.image = "/images/radio_off.png";
		deliveryRadioButton.image = "/images/radio_on.png";
	}
	pickupRadioButton.addEventListener('click', onPicupRadioButton);
	deliveryRadioButton.addEventListener('click', onDeliveryRadioButton);
	placeOrderBtn.addEventListener('click', goToPaymentWin);
	payInPersonBtn.addEventListener('click', payInPerson);
}

createMyOrder();

$.selectedMenuItemList.addEventListener('itemclick', function(e) {
	itemIndex = e.itemIndex;
	if (_.isUndefined(this.sections[0])) {
		return;
	}
	itemData = this.sections[0].getItemAt(itemIndex);
	if (_.isUndefined(itemData) || !itemData) {
		return;
	}
	switch(e.bindId) {
	case "editImg":
		Ti.API.info("selected****before---->" + JSON.stringify(selectedMenuItems[itemIndex]));
		
		//Ti.API.info("**************simp **********data********* " + JSON.stringify(simpData));
		Alloy.createController('menuItemDetails', {
			menuItem : selectedMenuItems[itemIndex],
			companyId:args.companyId,
			callback : function(updatedQuantity, _selectedModifiers) {
				selectedMenuItems[itemIndex].quantity = updatedQuantity;
				selectedMenuItems[itemIndex]['selectedModifiers'] = _selectedModifiers;
				Ti.API.info("selected *****aft** " + JSON.stringify(selectedMenuItems[itemIndex]));
				refreshMyOrder();
			}
		}).getView().open();
		break;
	case "cancelImg":
		var dialog = Ti.UI.createAlertDialog({
			title : "Are you Sure?",
			message : "you want to remove this item.",
			buttonNames : ['Yes', 'No'],
			cancel : 1
		});
		dialog.show();
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				selectedMenuItems.splice(itemIndex, 1);
				if (selectedMenuItems.length == 0) {
					closeWindow();
					return;
				}
				$.selectedMenuItemList.sections[0].deleteItemsAt(itemIndex, 1);
				updateSubTotalAndTotalPrice(itemData["pricelbl"].text.split('$')[1]);
			}
		});
		break;
	}
});
