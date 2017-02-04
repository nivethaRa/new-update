var args = arguments[0];
var serviceUtility = require('ServiceUtility'),
    SFEZKeys = require('SFEZKeys'),
    moment = require('alloy/moment');

(OS_IOS) ? ($.win.title = args.vendorName) : ($.winTitle.text = args.vendorName);
$.win.barColor = Alloy.Globals.navBarColor;
$.win.navTintColor = "white";
var selectedItems = Alloy.Globals.selectedMenuItems;
var cartId = moment().format("X");
//alert(args.companyId);
var deliveryCharge = args.deliveryCharge;
var delivery_charge_item_id = args.delivery_charge_item_id;
//Alloy.Globals.CategoryData
//Alloy.Globals.MenuData

function checkOutNavButtonHandler() {

}

function closeWindow() {
	$.getView().close();
	Alloy.Globals.selectedMenuItems = [];
}

function gotoMyOrder() {
	Alloy.createController('myCart', {
		selectedItems : selectedItems,
		cartId : cartId,
		vendorName:args.vendorName,
		companyId:args.companyId,
		deliveryCharge:deliveryCharge,
		delivery_charge_item_id:delivery_charge_item_id,
		callback : function(updatedItems) {
			$.myOrderTable.removeAllChildren();
			$.menuItemSelectedCount.text = updatedItems.length;
			(updatedItems.length > 0) && populateSelectedMenuItems(updatedItems);
		}
	}).getView().open();
}

function goToMyOrder() {
	if (selectedItems.length > 0) {
		gotoMyOrder();
	} else {
		alert("Do select some items first.");
	}
}

function getTotalAmount(a, b) {
	return (((a + b) * 10) / 10).toFixed(2);
}

function totalProductPrice(price, quantity) {
	return (((price.split('$')[1] * quantity) * 10) / 10).toFixed(2);
}

var lastLbl;
function populateSelectedMenuItems(data) {
	var subTotal = 0;
	var newData = [];
	for (var i = 0; i < data.length; i++) {
		Ti.API.info("**********populateSelectedMenuItems**************** " + subTotal + " " + data[i].price.split('$')[1]);
		var ithProductTotalPrice = totalProductPrice(data[i].price, data[i].quantity);
		subTotal = getTotalAmount(Number(subTotal), Number(ithProductTotalPrice));
		var baseView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			top : 5,
			left : 0,
			right : 0,
			orderId : i,
			backgroundColor : Alloy.Globals.mapsBackgroundColor
		});

		var editImg = Ti.UI.createImageView({
			top : 8,
			left : 10,
			height : 20,
			width : 20,
			// backgroundColor : "blue"
			image : "/images/note.png",
		});

		baseView.add(editImg);

		var titlelbl = Ti.UI.createLabel({
			left : 40,
			right : 100,
			top : 5,
			text : data[i].quantity + " X " + data[i].name,
			font : {
				fontSize : 16,
				fontFamily : 'Lucida Grande',
				fontWeight : "bold"
			},
			color : "#000",
		});

		baseView.add(titlelbl);

		var desclbl = Ti.UI.createLabel({
			left : 40,
			right : 100,
			top : 30,
			text : data[i].description,
			font : {
				fontSize : 11,
				fontFamily : 'Lucida Grande',
			},
			color : "#000",
			opacity : 0.6
		});

		baseView.add(desclbl);

		var pricelbl = Ti.UI.createLabel({
			right : 40,
			top : 5,
			text : 'R$' + ithProductTotalPrice,
			font : {
				fontSize : 16,
				fontFamily : 'Lucida Grande',
			},
			color : "#000",
		});

		baseView.add(pricelbl);

		var cancelImg = Ti.UI.createImageView({
			top : 8,
			right : 10,
			height : 20,
			width : 20,
			image : "/images/consumerordering/delete.png",
			// backgroundColor : "blue"
		});

		baseView.add(cancelImg);

		$.myOrderTable.add(baseView);
	}

	var sap = Ti.UI.createView({
		height : 2,
		width : Titanium.UI.FILL,
		top : 10,
		backgroundColor : "#CACACA"
	});
	$.myOrderTable.add(sap);

	var totalView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Titanium.UI.FILL,
		top : 0,
		// layout:"vertical"
	});
	$.myOrderTable.add(totalView);

	var totalLbl = Ti.UI.createLabel({
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

	totalView.add(totalLbl);

	var totalPriceLbl = Ti.UI.createLabel({
		right : 40,
		top : 10,
		text : 'R$' + subTotal,
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	totalView.add(totalPriceLbl);

	//Service Change
	var serviceLbl = Ti.UI.createLabel({
		left : 40,
		right : 100,
		top : 40,
		text : "Service Charge",
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	totalView.add(serviceLbl);

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

	totalView.add(servicePriceLbl);

	var sap = Ti.UI.createView({
		height : 2,
		width : Titanium.UI.FILL,
		top : 10,
		backgroundColor : "#CACACA"
	});
	$.myOrderTable.add(sap);

	var totalCountView = Ti.UI.createView({
		height : 30,
		width : Titanium.UI.FILL,
		top : 0,
		// layout:"horizontal"
	});
	$.myOrderTable.add(totalCountView);

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

	var funalPriceLbl = Ti.UI.createLabel({
		right : 40,
		top : 10,
		text : 'R$' + getTotalAmount(Number(subTotal), Number("1.60")),
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
	});

	totalCountView.add(funalPriceLbl);

	var sap = Ti.UI.createView({
		height : 2,
		width : Titanium.UI.FILL,
		top : 10,
		backgroundColor : "#CACACA"
	});
	$.myOrderTable.add(sap);

	var placeOrderBtn = $.UI.create('Button', {
		top : 20,
		title : L('MyOrderPlaceOrder'),
		classes : ["searchLocation"],
		color : Alloy.Globals.lightTextColor,
		font : {
			fontSize : 14,
			fontFamily : 'Lucida Grande',
			fontWeight : "bold"
		},
		backgroundColor : Alloy.Globals.buttonColor3,
		borderColor : Alloy.Globals.buttonColor3,
		height : Alloy.Globals.searchButtonHeight,
		width : 200,
		top : 15,
		borderRadius : 2

	});
	$.myOrderTable.add(placeOrderBtn);

	var placeOrderView = $.UI.create('View', {
		top : 0,
		classes : ["heightSize"],
	});
	$.myOrderTable.add(placeOrderView);

	var placeOrderImgView = $.UI.create('ImageView', {
		classes : ["menuImg"],
	});
	placeOrderView.add(placeOrderImgView);

	var placeOrderLbl = $.UI.create('Label', {
		top : 100,
		classes : ["menuorderLbl"],
		text : L("add_to_order")
	});

	placeOrderView.add(placeOrderLbl);
}

$.myOrderTable.addEventListener("click", function(e) {
	gotoMyOrder();
});

function populateMenuItems(data) {
	var dataRow = [];
			
		
	var MenuImage = "";
	var menuItemImg ="";
	for (var i = 0; i < data.length; i++) {
		Ti.API.info("*********populateMenuItems***********inside loop************* " + data[i].id + " " + data[i].title + " " + data[i].price.value + " " + data[i].description);
		var row = Ti.UI.createTableViewRow({
			height : 70,
			left : 0,
			right : 0,
			backgroundColor : Alloy.Globals.mapsBackgroundColor,
			itemId : data[i].id
		});

		var baseView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			top : 5,
			left : 0,
			right : 0,
			orderId : i,
			backgroundColor : Alloy.Globals.mapsBackgroundColor
		});

		 Alloy.Globals.Services.Vendor.GetMenuImage(args.companyId,data[i].id, function(resp) {
				for (var j = 0; j < resp.images.length; j++) {
					MenuImage = resp.images[0].url.https;
					menuItemImg = Ti.UI.createImageView({
						right : 10,
						height : 35,
						width : 70,
						top : 25,
						image : MenuImage
					});
					baseView.add(menuItemImg);		
					row.menuItemImg = menuItemImg;
				}
		});
		
	
		var titleAndPriceLbl = Ti.UI.createLabel({
			left : 15,
			right : 100,
			top : 5,
			text : data[i].title + " - " + data[i].price.value,
			font : {
				fontSize : 16,
				fontFamily : 'Lucida Grande',
				fontWeight : "bold"
			},
			color : "#000",
		});

		baseView.add(titleAndPriceLbl);

		var desclbl = Ti.UI.createLabel({
			left : 15,
			right : 100,
			top : 30,
			text : data[i].description,
			font : {
				fontSize : 11,
				fontFamily : 'Lucida Grande',
			},
			color : "#000",
			opacity : 0.6,
			maxLines : 2,
			//wordWrap : false,
			//ellipsize : true
		});

		baseView.add(desclbl);

		var addToCartImage = Ti.UI.createImageView({
			right : 10,
			top : 5,
			image : "/images/consumerordering/img_addToCart.png",
			height : 15,
			width : Ti.UI.SIZE,
		});

		baseView.add(addToCartImage);

	   
        Ti.API.info('OUTSIDE::----------------------------------------> '  );	
		row.addToCartImage = addToCartImage;


		row.add(baseView);
		dataRow.push(row);
	}
	$.tacosTable.setData(dataRow);
}

$.tacosTable.addEventListener("click", function(e) {
	//if (e.row.addToCartImage.visible == true) {
	//e.row.addToCartImage.hide();
	//e.row.menuItemImg.top = 15;
	var menues = Alloy.Globals.getData(SFEZKeys.KEYS.MENU_DATA);
	for (var i = 0; i < menues.length; i++) {
		for (var j = 0; j < menues[i].menuData.length; j++) {
			if (menues[i].menuData[j].id == e.row.itemId) {
				var modifiers = _.isArray(menues[i].menuData[j].modifiers) ? menues[i].menuData[j].modifiers : new Array(menues[i].menuData[j].modifiers);
				Ti.API.info("**************modifiers************** " + typeof modifiers + " " + modifiers.length);
				var menu = {
					name : menues[i].menuData[j].title,
					description : menues[i].menuData[j].description,
					price : (menues[i].menuData[j].price.value.split('R')[1]).replace(/,/g, ''),
					quantity : 1,
					productId : menues[i].menuData[j].id,
					isModifier : (modifiers.length > 0) ? true : false,
					modifiers : modifiers
				};
				selectedItems.push(menu);
				$.menuItemSelectedCount.text = selectedItems.length;
				$.myOrderTable.removeAllChildren();
				populateSelectedMenuItems(selectedItems);
				//to break outer loop
				i = menues.length;
				break;
			}
		}
	}
	//}
});

function createCategory(data) {
	Ti.API.info("*************createCategory***************** " + data.length);
	for (var i = 0; i < data.length; i++) {
		Ti.API.info('data[i].title ' + data[i].title);
		var categoryView = $.UI.create('View', {
			classes : ["scrollTabs"],
			layout : "vertical",
			cat_id : data[i].id
		});
		var catLbl = $.UI.create('Label', {
			top : 15,
			left : 0,
			text : data[i].title,
			touchEnabled : false,
			width : Ti.UI.SIZE,
			font : {
				fontSize : 15,
				fontFamily : 'Lucida Grande',
				fontWeight : "bold"
			},
			color : Alloy.Globals.lightTextColor,
		});
		categoryView.add(catLbl);
		if (i == 0) {
			catLbl.color = Alloy.Globals.buttonColor;
			lastLbl = catLbl;
		}
		$.middleScroll.add(categoryView);
	};
	//load default category menu items
	checkForMenuItemExistence(data[0].id);
}

function checkForMenuItemExistence(_categoryId) {
	if (Alloy.Globals.getData(SFEZKeys.KEYS.MENU_DATA)) {
		var isAlreadyExist = false;
		var menues = Alloy.Globals.getData(SFEZKeys.KEYS.MENU_DATA);
		for (var i = 0; i < menues.length; i++) {
			if (menues[i]._categoryId == _categoryId) {
				isAlreadyExist = true;
				populateMenuItems(menues[i].menuData);
				break;
			}
		}
		if (!isAlreadyExist) {
			getMenuItemsFromServer(_categoryId);
		}
	} else {
		getMenuItemsFromServer(_categoryId);
	}
}

function getMenuItemsFromServer(categoryId) {
	Alloy.Globals.Services.Vendor.getMenuItems(categoryId, function(resp) {
		Ti.API.info('categoryID:: '+ categoryId );
		Ti.API.info('menuItems:: ' + JSON.stringify(resp));

		if (resp.length > 0) {
			var menuData = (Alloy.Globals.getData(SFEZKeys.KEYS.MENU_DATA)) ? Alloy.Globals.getData(SFEZKeys.KEYS.MENU_DATA) : [];
			menuData.push({
				_categoryId : categoryId,
				menuData : resp
			});
			Alloy.Globals.setData(SFEZKeys.KEYS.MENU_DATA, menuData);
			populateMenuItems(resp);
		} else {
			//alert("Record Not Found");
		}
	});
}

function categoryClicked(ev) {
	Ti.API.info('btn data  ' + ev.source.cat_id + " " + JSON.stringify(ev));
	if (ev.source.children[0] != null) {
		ev.source.children[0].color = Alloy.Globals.buttonColor;
		lastLbl.color = Alloy.Globals.lightTextColor;
		lastLbl = ev.source.children[0];
	}
	$.tacosTable.setData([]);
	checkForMenuItemExistence(ev.source.cat_id);
}

if (Alloy.Globals.getData(SFEZKeys.KEYS.CATEGORY_DATA)) {
	var isAlreadyExist = false;
	var categories = Alloy.Globals.getData(SFEZKeys.KEYS.CATEGORY_DATA);
	for (var i = 0; i < categories.length; i++) {
		if (categories[i]._orderSysId == args.orderSysId) {
			isAlreadyExist = true;
			createCategory(categories[i].categoryData);
			break;
		}
	}
	if (!isAlreadyExist) {
		fetchCategoriesFromServer();
	}
} else {
	fetchCategoriesFromServer();
}

function fetchCategoriesFromServer() {
	Alloy.Globals.Services.Vendor.GetCategories(args.orderSysId, function(resp) {
		if (resp.length > 0) {
			var orderrSysId = args.orderSysId;
			var categoryData = (Alloy.Globals.getData(SFEZKeys.KEYS.CATEGORY_DATA)) ? Alloy.Globals.getData(SFEZKeys.KEYS.CATEGORY_DATA) : [];
			categoryData.push({
				_orderSysId : orderrSysId,
				categoryData : resp
			});
			Alloy.Globals.setData(SFEZKeys.KEYS.CATEGORY_DATA, categoryData);
			createCategory(resp);
		} else {
			alert("Record Not Found");
		}
	});
}
