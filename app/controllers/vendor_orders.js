var isClicked = false;
var status = ["In Queue", "Cooking", "Ready", "Order pickup"];
function createTakeoutList(_ordersData) {
	var dataRows = [];
	for (var i = 0; i < _ordersData.length; i++) {
		Ti.API.info("*************createTakeoutList*********2********* " + JSON.stringify(_ordersData[i]));
		var row = Ti.UI.createTableViewRow({
			height : 75,
			id : "status",
			extend : true,
			parantObj : row,
			left : 0,
			right : 0,
			selectedColor : "#FFF",
			backgroundColor : "white",
			layout : "vertical",
			orderId : _ordersData[i].id
		});

		var mainView = Ti.UI.createView({
			height : 50,
			layout : "horizontal",
			backgroundColor : "transparent",
			extend : true,
			parantObj : row,
		});

		var iconImg = Ti.UI.createImageView({
			left : Alloy.Globals.navigatorIconPadding,
			height : 30,
			width : 30,
			id : "status",
			extend : true,
			parantObj : row,
			bottom : 10,
			top : 20,
			image : "/images/foodtruckBlack.png"
		});

		mainView.add(iconImg);

		var extView = Ti.UI.createView({
			top : 0,
			left : 5,
			id : "status",
			extend : true,
			parantObj : row,
			height : Ti.UI.FILL,
			layout : "vertical",
			width : 110,
			textAlign : "left",
			backgroundColor : "transparent"
		});
		var titleLbl = Ti.UI.createLabel({
			top : 5,
			left : 5,
			text : "11:45 AM",
			textAlign : "left",
			id : "status",
			extend : true,
			parantObj : row,
			font : {
				fontFamily : "Raleway",
				fontSize : 18
			},
			color : Alloy.Globals.navBarColor,
			height : 20,
		});
		extView.add(titleLbl);
		var subTitleLbl = Ti.UI.createLabel({
			text : _ordersData[i].customer.data.first_name + " " + _ordersData[i].customer.data.last_name,
			top : 5,
			left : 5,
			font : {
				fontFamily : "Raleway",
				fontSize : 14
			},
			color : "Black",
			textAlign : "left",
			height : 20,
			id : "status",
			extend : true,
			parantObj : row
		});
		extView.add(subTitleLbl);

		var orderIdView = Ti.UI.createView({
			top : 3,
			height : Ti.UI.SIZE,
			id : "status",
			extend : true,
			parantObj : row,
			width : 80,
			layout : "vertical"
		});
		var orderId = Ti.UI.createLabel({
			top : 5,
			id : "status",
			extend : true,
			parantObj : row,
			text : "#" + _ordersData[i].id.slice(-4),
			font : {
				fontFamily : "Raleway",
				fontSize : 16,
				fontWeight : "bold"
			},
			color : "Black",
			height : 20,
		});
		orderIdView.add(orderId);

		mainView.add(extView);
		mainView.add(orderIdView);

		// var rightImg = $.UI.create('ImageView', {
		// left : 25,
		// id : "addEdit",
		// image : "/images/note.png"
		// });

		var button = Titanium.UI.createButton({
			title : 'In Queue',
			id : "status",
			extend : true,
			parantObj : row,
			top : 10,
			left : 5,
			width : 100,
			font : {
				fontFamily : "Raleway",
				fontSize : 12,
				fontWeight : "bold"
			},
			color : "#fff",
			backgroundColor : "#000",
			height : 25
		});

		/*if (i == 0 || i == 8) {
		 button.title = "Picked Up";
		 button.backgroundColor = "#D5D6C9";
		 } else if (i == 1 || i == 6) {
		 button.title = "Ready";
		 button.backgroundColor = "#67C5EB";
		 } else if (i == 2 || i == 9) {
		 button.title = "Cooking";
		 button.backgroundColor = "#A11F62";
		 } else {
		 button.title = "In Queue";
		 button.backgroundColor = "#77776B";
		 }*/

		mainView.add(button);
		var totalPaid = Ti.UI.createLabel({
			text : "Total Paid:  " + _ordersData[i].total + " " + _ordersData[i].currency_code,
			top : 0,
			left : 50,
			font : {
				fontFamily : "Raleway",
				fontSize : 14
			},
			color : "Black",
			textAlign : "left",
			height : 20,
			width : Ti.UI.FILL,
			id : "status",
			extend : true,
			parantObj : row
		});
		row.add(mainView);
		row.add(totalPaid);

		dataRows.push(row);
	}

	$.takeoutTable.setData(dataRows);

	$.takeoutTable.addEventListener("click", function(e) {
		if ("status" == e.source.id) {
			console.log("in if");
			var currentObj;
			if (e.source.extend) {
				console.log("in extend");
				e.source.parantObj.backgroundColor = "#FFF";
				e.source.extend = false;
				Alloy.Globals.loading.show("Loading...", false);
				Alloy.Globals.Services.Vendor.getOrderItems(e.source.parantObj.orderId, function(response) {
					Alloy.Globals.loading.hide();
					Alloy.Globals.orderItems = response;
					createTakeoutExpandView(response, e.source);
				});
			} else {
				if (!e.source.parantObj || !e.source.currentObj) {
					return;
				}
				e.source.parantObj.backgroundColor = Alloy.Globals.mapsBackgroundColor;
				e.source.extend = true;
				e.source.parantObj.height = 75;
				e.source.parantObj.remove(e.source.currentObj);
			}
		}
		// Ti.API.info('data ' + e.source + "    " + JSON.stringify(e.source));
		// if ("addEdit" == e.source.id)
		// {
		// //Alloy.createController('editReview').getView().open();
		// var reviewControl = Alloy.createController('/foodtruck/vendor_add_loyalty').getView();
		// Alloy.Globals.tabVendor.activeTab.open(reviewControl);
		// }
	});
}

function getProductView(productArr) {
	var lbl1 = $.UI.create('Label', {
		text : productArr.title, //productArr.quantity + "X" + productArr.title,
		top : 2,
		left : 40,
		font : {
			fontFamily : "Raleway",
			fontSize : 14,
			fontWeight : "bold"
		},
		classes : ["H1BlkLbl"],
		height : 40,
		wordWrap : false,
		ellipsize : true,
		maxLines : 1
	});
	return lbl1;
}

function addSeparator() {
	var line = Ti.UI.createView({
		height : 2,
		top : 5,
		bottom : 0,
		left : 0,
		right : 0,
		borderWidth : 1,
		borderColor : '#E5E4DF'
	});
	return line;
}

// for Takeout Expand view
function createTakeoutExpandView(data, _view) {
	//create Extending view
	var extMainView = Ti.UI.createView({
		top : 0,
		left : 0,
		bottom : 0,
		right : 0,
		height : Ti.UI.SIZE,
		layout : "vertical",
		backgroundColor : "#F2F2F0"
	});

	var extendLbl = $.UI.create('Label', {
		text : "Select Status",
		top : 5,
		left : 0,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontFamily : "Raleway",
			fontSize : 12,
			fontWeight : "bold"
		},
		classes : ["H1BlkLbl"],
	});

	extMainView.add(extendLbl);
	var extView = Ti.UI.createView({
		top : 1,
		bottom : 0,
		left : 0,
		right : 0,
		height : 90,
		layout : "horizontal",
		backgroundColor : "#F2F2F0"
	});

	for (var i = 0; i < status.length; i++) {
		var h1 = Ti.UI.createView({
			top : 0,
			left : 0,
			height : 90,
			width : "25%",
			layout : "vertical",
		});

		var statusView = $.UI.create('View', {
			_id : i,
			idCheck : "false",
			top : 5,
			bottom : 2,
			height : 80,
			width : 80,
			borderRadius : 3,
			borderWidth : 1,
			borderColor : "#a1a1a1",
			layout : "vertical"
		});

		var statusImage = $.UI.create('ImageView', {
			top : 5,
			height : 50,
			width : 50,
			image : "/images/qr_code.png",
			bubbleParent : true,
			touchEnabled : false
		});

		var statusLabel = $.UI.create('Label', {
			top : 5,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			wordWrap : false,
			ellipsize : true,
			maxLines : 1,
			text : status[i],
			font : {
				fontFamily : "Raleway",
				fontSize : 12,
			},
			bubbleParent : true,
			touchEnabled : false
		});

		statusView.add(statusImage);
		statusView.add(statusLabel);

		/*if (i == 0) {
		 statusView.image = "/images/inqueue_unselect.png";
		 } else if (i == 1) {
		 statusView.image = "/images/cooking_unselect.png";
		 } else if (i == 2) {
		 statusView.image = "/images/order_unselect.png";
		 } else if (i == 3) {
		 statusView.image = "/images/ready_unselect.png";
		 }*/

		statusView.addEventListener("click", function(e) {
			if (e.source._id == 2) {
				var QRCode = Alloy.createController('validateJujo').getView();
				QRCode.open();
			}
			/*if (!e.source.idCheck) {
			 e.source.idCheck = true;
			 //e.source.image = "/images/inqueue_select.png";
			 if (e.source._id == 0) {
			 e.source.image = "/images/inqueue_select.png";
			 } else if (e.source._id == 1) {
			 e.source.image = "/images/cooking_select.png";
			 } else if (e.source._id == 2) {
			 e.source.image = "/images/order_select.png";
			 } else if (e.source._id == 3) {
			 e.source.image = "/images/ready_select.png";
			 var QRCode = Alloy.createController('vendor_OrderScanQRCode').getView();
			 // Alloy.Globals.tabVendor.activeTab.open(QRCode);
			 QRCode.open();
			 }
			 } else {
			 e.source.idCheck = false;
			 //e.source.idCheck = true;
			 //e.source.image = "/images/inqueue_select.png";
			 if (e.source._id == 0) {
			 e.source.image = "/images/inqueue_unselect.png";
			 } else if (e.source._id == 1) {
			 e.source.image = "/images/cooking_unselect.png";
			 } else if (e.source._id == 2) {
			 e.source.image = "/images/order_unselect.png";
			 } else if (e.source._id == 3) {
			 e.source.image = "/images/ready_unselect.png";
			 }
			 }*/
		});
		h1.add(statusView);
		extView.add(h1);
	}

	extMainView.add(extView);

	extMainView.add(addSeparator());

	var labelView = Ti.UI.createView({
		top : 0,
		left : 0,
		height : Ti.UI.SIZE,
		width : "100%",
		layout : "vertical",
	});

	for (var i = 0; i < data.length; i++) {
		labelView.add(getProductView(data[i]));
		labelView.add(addSeparator());
	}
	/*var lbl2 = $.UI.create('Label', {
	 text : "Lettuce, Cheese, Sour Cream",
	 top : 1,
	 left : 40,
	 font : {
	 fontFamily : "Raleway",
	 fontSize : 10,
	 },
	 classes : ["H1BlkLbl"],
	 });*/
	extMainView.add(labelView);
	_view.currentObj = extMainView;
	_view.parantObj.add(extMainView);
	_view.parantObj.height = (200 + (Number(data.length) * 40));
	//return extMainView;
}

// create Rewars Table
function createDeliverList() {
	var dataRows = [];
	for (var i = 0; i < 10; i++) {

		var row = Ti.UI.createTableViewRow({
			height : 60,
			left : 0,
			right : 0,
			selectedColor : "#FFF",
			layout : "horizontal",
			backgroundColor : "white"
		});

		var iconImg = Ti.UI.createImageView({
			left : Alloy.Globals.navigatorIconPadding,
			height : 30,
			width : 30,
			bottom : 10,
			top : 20,
			backgroundColor : "#fff",
			image : "/images/foodtruckBlack.png"
		});

		row.add(iconImg);

		var extView = Ti.UI.createView({
			top : 5,
			left : 5,
			height : 50,
			layout : "vertical",
			width : 110,
			textAlign : "left",
			backgroundColor : "transparent"
		});

		var titleLbl = Ti.UI.createLabel({
			top : 5,
			left : 5,
			text : "11:45 AM",
			textAlign : "left",
			font : {
				fontFamily : "Raleway",
				fontSize : 18
			},
			color : Alloy.Globals.navBarColor,
			height : 20,
			width : 90,
		});
		extView.add(titleLbl);

		var subTitleLbl = Ti.UI.createLabel({
			text : "Heather D",
			top : 5,
			left : 5,
			font : {
				fontFamily : "Raleway",
				fontSize : 12
			},
			color : "Black",
			textAlign : "left",
			height : 20,
			width : 90,
		});
		extView.add(subTitleLbl);
		row.add(extView);
		// var titleLbl = Ti.UI.createLabel({
		// left : 80,
		// top : 5,
		// text : "Pacos Tacos",
		// font:{
		// fontFamily:"Raleway",
		// fontSize:19
		// },
		// color : Alloy.Globals.buttonColor,
		// height : 20,
		// right : 60,
		// });
		//
		// row.add(titleLbl);
		//
		// var ratingLbl = Ti.UI.createLabel({
		// left : 80,
		// top : 25,
		// id : "ViewDetails",
		// extend : true,
		// parantObj : row,
		// text : "View Details +",
		// font:{
		// fontFamily:"Raleway",
		// fontSize:12
		// },
		// color : Alloy.Globals.buttonColor3,
		// height : 20,
		// width : 90,
		// });
		//
		// row.add(ratingLbl);

		var pointView = Ti.UI.createView({
			top : 8,
			height : 50,
			width : 80,
			layout : "vertical",
			backgroundColor : "transparent"
		});
		var pointLbl = Ti.UI.createLabel({
			top : 5,
			id : "status",
			extend : true,
			parantObj : row,
			text : "#99512",
			font : {
				fontFamily : "Raleway",
				fontSize : 16,
				fontWeight : "bold"
			},
			color : "Black",
		});

		var subPointLbl = Ti.UI.createLabel({
			top : 1,
			text : "Est. 1 min",
			font : {
				fontFamily : "Raleway",
				fontSize : 11,
			},
			color : "Black",
		});

		pointView.add(pointLbl);
		pointView.add(subPointLbl);
		row.add(pointView);

		var button = Titanium.UI.createButton({
			title : 'Order Pickup',
			top : 15,
			width : 100,
			font : {
				fontFamily : "Raleway",
				fontSize : 12,
				fontWeight : "bold"
			},
			color : "#fff",
			backgroundColor : "#000",
			height : 25
		});

		if (i == 0 || i == 8) {
			button.title = "Picked Up";
			button.backgroundColor = "#D5D6C9";
		} else if (i == 1 || i == 6) {
			button.title = "Ready";
			button.backgroundColor = "#67C5EB";
		} else if (i == 2 || i == 9) {
			button.title = "Cooking";
			button.backgroundColor = "#A11F62";
		} else {
			button.title = "In Queue";
			button.backgroundColor = "#77776B";
		}

		row.add(button);

		dataRows.push(row);
	}

	$.deliveryTable.setData(dataRows);

	$.deliveryTable.addEventListener("click", function(e) {
		if ("ViewDetails" == e.source.id) {
			var currentObj;
			if (e.source.extend) {
				e.source.parantObj.hide1.visible = true;
				e.source.parantObj.hide2.visible = true;
				e.source.parantObj.backgroundColor = "#FFF";
				e.source.extend = false;
				e.source.parantObj.height = 300;
				e.source.text = "View Details -";
				var currentObj = createExpandView("");
				e.source.currentObj = currentObj;
				e.source.parantObj.add(currentObj);
			} else {
				e.source.parantObj.hide1.visible = false;
				e.source.parantObj.hide2.visible = false;
				e.source.parantObj.backgroundColor = Alloy.Globals.mapsBackgroundColor;
				e.source.extend = true;
				e.source.parantObj.height = 60;
				e.source.text = "View Details +";
				e.source.parantObj.remove(e.source.currentObj);
			}
		}

	});
}

function openTakeout() {
	if (!isClicked) {
		isClicked = true;

		$.deliveryTable.hide();
		$.takeoutTable.show();

		// createLoyaltyList();
		// $.loyaltyRewardsView.remove($.rewardsTable);
		// $.loyaltyRewardsView.add($.loyaltyTable);

		$.rewatdsH.color = "gray";
		$.loyaltyH.color = Alloy.Globals.navBarColor;
		$.baseLineLoyal.backgroundColor = Alloy.Globals.navBarColor;
		$.baseLineLoyal.show();
		$.baseLineReward.hide();
	}
}

function openDelivery() {
	if (isClicked) {
		isClicked = false;

		$.deliveryTable.show();
		$.takeoutTable.hide();

		$.loyaltyH.color = "gray";
		$.rewatdsH.color = Alloy.Globals.navBarColor;
		$.baseLineReward.backgroundColor = Alloy.Globals.navBarColor;
		$.baseLineReward.show();
		$.baseLineLoyal.hide();
	}
}

function getOrders(_ifListAlreadyThere) {
	Alloy.Globals.Services.Vendor.getOrders(function(response) {
		Alloy.Globals.orders = response;
		!_ifListAlreadyThere && createTakeoutList(response);
	});
}


Alloy.Globals.orders && createTakeoutList(Alloy.Globals.orders);
(function() {
	if (Alloy.Globals.orders) {
		createTakeoutList(Alloy.Globals.orders);
		getOrders(true);
	} else {
		getOrders(false);
	}
})();

createDeliverList();
openTakeout();

// for Delivery Expand view
function createExpandView(data) {
	//create Extending view
	var extView = Ti.UI.createView({
		top : 60,
		left : 0,
		right : 0,
		height : 230,
		layout : "horizontal",
		backgroundColor : "#FFF"
	});

	for (var i = 0; i < 3; i++) {

		var h1 = Ti.UI.createView({
			top : 0,
			left : 0,
			height : 240,
			width : "33%",
			layout : "vertical",
		});

		var goldImg = $.UI.create('ImageView', {
			top : 10,
			height : 40,
			width : 55,
			// classes : ["loveImg"],
		});

		if (i == 0) {
			goldImg.image = "/images/prize_gold.png";
		} else if (i == 1) {
			goldImg.image = "/images/prize_silver.png";
		} else if (i == 2) {
			goldImg.image = "/images/prize_bronze.png";
		} else {
			goldImg.image = "/images/prize_gold.png";
		}

		h1.add(goldImg);

		var goldLbl = $.UI.create('Label', {
			text : "Gold",
			top : 5,
			left : 0,
			right : 0,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontFamily : "Raleway",
				fontSize : 16,
				fontWeight : "bold"
			},
			classes : ["H1BlkLbl"],
		});

		h1.add(goldLbl);

		var backView = $.UI.create('View', {
			top : 5,
			//left : 43,
			height : 40,
			width : 40,
			layout : "vertical",
			backgroundImage : "/images/circle.png"
		});

		h1.add(backView);

		var ptsLbl = $.UI.create('Label', {
			text : "15",
			top : 5,
			font : {
				fontFamily : "Raleway",
				fontSize : 14
			},
			classes : ["H2BoldLbl"],
		});

		backView.add(ptsLbl);

		var pts = $.UI.create('Label', {
			text : "pts",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			top : 0,
			width : 20,
			font : {
				fontFamily : "Raleway",
				fontSize : 10
			},
			classes : ["H2BlkLbl"],
			opacity : 0.6
		});

		backView.add(pts);

		var redeemImg = $.UI.create('ImageView', {
			top : 0,
			width : 70,
			height : 43,
		});

		if (i == 0) {
			goldLbl.text = "Gold";
		} else if (i == 1) {
			goldLbl.text = "Silver";
			h1.add(redeemImg);
			redeemImg.image = "/images/redeem.png";
		} else if (i == 2) {
			goldLbl.text = "Bronze";
			h1.add(redeemImg);
			redeemImg.image = "/images/redeem.png";
		}

		var itemLbl = $.UI.create('Label', {
			text : "1 sandwitch 1 side & 1 drink",
			top : 10,
			left : 10,
			right : 10,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontFamily : "Raleway",
				fontSize : 14
			},
			classes : ["H2BlkLbl"],
		});

		h1.add(itemLbl);
		extView.add(h1);

	}

	return extView;
}
