var serviceUtility = require('ServiceUtility'),
    SFEZKeys = require("SFEZKeys");
// var moltin = new Moltin({publicId: 'QtDrN2fxN3JGsKQvNgtahF5jz1MPP6kVV4wZTavq15'});
// moltin.Authenticate(function() {
// console.log("Moltin success fully Auth");
// });

/*var apiUrl = "http://198.199.86.137:1337/api/v1/rel/";*/
var apiUrl = "http://198.199.86.137:1337/api/v1/rel/";

//
var AppServices = {};
AppServices.User = {};
AppServices.User.currentUser = {};
AppServices.User.isLoggedIn = false;
AppServices.User.role = "Consumer";
Ti.App.Properties.setString('lastRole', 'Consumer');

// "users_review":"users",
// "reviews":"reviews",
// "categories":"categories",
// "menuItems":"menuItems",
// "optionItems":"optionItems",
// "mobileVendors":"mobileVendors",
// "dailySpecials":"dailySpecials",
// "foodParks":"foodParks",
// "companies":"companies"
AppServices.access_token_customer = "";
AppServices.access_token_vendor = "";

AppServices.AuthMoltinCusomters = function(callback) {
	Ti.API.info("*****************AuthMoltinCusomters API called***************");
	var api = "https://api.molt.in/oauth/access_token";
	var params = {
		"client_id" : "QtDrN2fxN3JGsKQvNgtahF5jz1MPP6kVV4wZTavq15",
		"grant_type" : "implicit"
	};
	serviceUtility.post(api, params, function(e) {
		Ti.API.info('post response:: for AuthMoltinCusomters' + JSON.stringify(e));
		if (e.access_token != undefined) {
			AppServices.access_token_customer = e.access_token;
			Ti.App.Properties.setString(SFEZKeys.KEYS.CUSTOMER_ACCESS_TOKEN, e.access_token);
			callback(true);
		} else {
			callback(false);
		}
	});
	return null;
};

AppServices.AuthMoltinCusomters(function(success) {
	console.log(success);
});

AppServices.AuthMoltinVendors = function(callback) {
	Ti.API.info("*****************AuthMoltinVendors API called***************");
	var api = "https://api.molt.in/oauth/access_token";
	var params = {
		"client_id" : "QtDrN2fxN3JGsKQvNgtahF5jz1MPP6kVV4wZTavq15",
		"client_secret" : "K5M1sc3PZuBVU3gn5iMzymWGecDk1HT90ZrjWVra6P",
		"grant_type" : "client_credentials"
	};
	serviceUtility.post(api, params, function(e) {
		Ti.API.info('post response:: for AuthMoltinVendors' + JSON.stringify(e));
		if (e.access_token != undefined) {
			AppServices.access_token_vendor = e.access_token;
			Ti.App.Properties.setString(SFEZKeys.KEYS.VENDOR_ACCESS_TOKEN, e.access_token);
			callback(true);
		} else {
			callback(false);
		}
	});
	return null;
};

AppServices.AuthMoltinVendors(function(success) {
	console.log(success);
});

// do user login
AppServices.User.login = function(params, successCallback, errorCallback) {
	var apiUrl = "http://198.199.86.137:1337/auth/login";
	serviceUtility.post(apiUrl, params, function(e) {
		Ti.API.info('post response:: ' + JSON.stringify(e));
		successCallback(e);
	}, function() {
		errorCallback();
	});
	return null;
};
// do user signup/registration
AppServices.User.Register = function(params, successCallback, errorCallback) {
	var apiUrl = "http://198.199.86.137:1337/auth/register";
	serviceUtility.post(apiUrl, params, function(e) {
		Ti.API.info('post response:: ' + JSON.stringify(e));
		successCallback(e);
	}, function() {
		errorCallback();
	});
	return null;
};
//check user login
AppServices.User.checkUserLoggedIn = function() {
	var jsonUser = Ti.App.Properties.getString('userInfo');
	var objUser = JSON.stringify(jsonUser);
	if (objUser != undefined && objUser != null) {
		AppServices.User.isLoggedIn = Ti.App.Properties.getBool('isLogin');
		AppServices.User.currentUser = objUser;
	}
	return null;
};
//Save user info when user logged in
AppServices.User.SaveLogininfo = function(userInfo) {
	var jsonUser = JSON.parse(userInfo);
	Ti.App.Properties.setString('userInfo', jsonUser);
	Ti.App.Properties.setBool('isLogin', AppServices.User.isLoggedIn);
};
//Signout user
AppServices.User.SignOut = function() {
	AppServices.User.isLoggedIn = false;
	Ti.App.Properties.setString('userInfo', null);
	Ti.App.Properties.setBool('isLogin', AppServices.User.isLoggedIn);
};

//Get user favorites
AppServices.User.GetFavorites = function() {

};
// Get user's orders
AppServices.User.GetOrders = function() {

};
// Get user's loyalty '
AppServices.User.GetLoyalty = function() {

};
// do Add to favorite company by user
AppServices.User.AddToFavorite = function(params) {

};

//Consumer Open public services
AppServices.Consumer = {};
AppServices.Consumer.GetDailySpecials = function(callback) {
	var url = apiUrl + "dailySpecials";
	serviceUtility.get(url, function(e) {
		Ti.API.info('dailySpecials:: ' + JSON.stringify(e));
		if (e.length > 0) {
			callback(e);
		} else {
			var emptyArray = [];
			callback(emptyArray);
		}
	});
};

AppServices.Vendor = {};
AppServices.Vendor.GetList = function(callback) {
	var url = apiUrl + "companies";
	serviceUtility.get(url, function(e) {
		Ti.API.info('companies:: GetList' + JSON.stringify(e));
		if (e.length > 0) {
			callback(e);
		} else {
			var emptyArray = [];
			callback(emptyArray);
		}
	});
};
/*
AppServices.Vendor.GetMenuImage = function(callback,compId,menuItemId,_image) {
	var url = "http://198.199.86.137:1337/api/v1/mol/" + "companies/"+compId+"/menuitems/"+menuItemId;
	Ti.API.info('Menu ImageURL:'+ url);
	serviceUtility.get(url, function(e) {
		Ti.API.info('companies:: GetList' + JSON.stringify(e));
		callback(e,_image);
	});
};*/

AppServices.Vendor.GetCategories = function(orderSysId, callback) {
	//Authorization: Bearer XXXX
	var url = "https://api.molt.in/v1/categories?company=" + orderSysId;
	if (AppServices.access_token_customer != "") {
		serviceUtility.get(url, function(e) {
			Ti.API.info('companies:: GetCategories' + JSON.stringify(e));
			if (e.result.length > 0) {
				callback(e.result);
			} else {
				callback([]);
			}
		});
	}
};

AppServices.Vendor.getMenuItems = function(categoryId, callback) {
	//Authorization: Bearer XXXX
	var url = "https://api.molt.in/v1/products?category=" + categoryId;
	if (AppServices.access_token_customer != "") {
		serviceUtility.get(url, function(e) {
			Ti.API.info('companies:: GetM enuItems' + JSON.stringify(e));
			if (e.result.length > 0) {
				callback(e.result);
			} else {
				callback([]);
			}
		});
	}
};

//Edited by Aryvart
AppServices.Vendor.GetMenuImage = function(compId,menuItemId,callback) {
	var url = "http://198.199.86.137:1337/api/v1/mol/" + "companies/"+compId+"/menuitems/"+menuItemId;
	Ti.API.info('Menu ImageURL:'+ url);
	serviceUtility.get(url, function(e) {
		Ti.API.info('GetImage' + JSON.stringify(e));
		callback(e);
	});
};
AppServices.Vendor.SetFavorites = function(customerID,callback) {
	/*var url = "http://198.199.86.137:1337/api/v1/rel/customers/"+customerID+"/favorites";*/
	var url = "http://198.199.86.137:1337/api/v1/rel/customers/9001/favorites";
	Ti.API.info('SetFavoritesURL:'+ url);
	serviceUtility.get(url, function(e) {
		Ti.API.info('SetFavorites' + JSON.stringify(e));
		callback(e);
	});
};

AppServices.Vendor.GETCOMPANYDETAILS = function(company_id,callback) {
	var url = "http://198.199.86.137:1337/api/v1/rel/companies/"+company_id;
	serviceUtility.get(url, function(e) {
		Ti.API.info('GETCOMPANIES' + JSON.stringify(e));
		callback(e);
	});
};

AppServices.Consumer.cartToOrder = function(params, callback) {
	var url = "https://api.molt.in/v1/carts/" + params.cartId + "/checkout";
	serviceUtility.post(url, params.requestData, function(e) {
		Ti.API.info('post response:: for cartToOrder' + JSON.stringify(e));
		if (e.result) {
			callback(e.result);
		} else {
			callback(false);
		}
	});
};

AppServices.Consumer.getCustomer = function(_id, callback) {
	var url = apiUrl + "customers?user_id=" + _id;
	serviceUtility.get(url, function(e) {
		Ti.API.info('post response:: for getCustomer' + JSON.stringify(e));
		callback(e);
	});
};




AppServices.User.sendUserDeviceTokenToServer = function(id) {
	var role = "";
	if (Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO)) {
		role = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO).user.role;
	}
	(role == "") && ( role = "CUSTOMER");
	var url = "";
	if(role == "CUSTOMER"){
		url = apiUrl+"customers/"+id;
	}
	if (Alloy.Globals.getData("deviceId") && (Alloy.Globals.getData("deviceId") != "")) {
		var requesData = {
			"device_id" : Alloy.Globals.getData("deviceId")
			//"user_email" : (role == "CUSTOMER") ? "sapna.sharma@oodlestechnologies.com" : "pankaj.kumar@oodlestechnologies.com"
		};
		serviceUtility.post(url, requesData, function(e) {
			Ti.API.info('post response:: for update device token' + JSON.stringify(e));
		}, function(e) {
			Ti.API.info('post error response:: for update device token' + e);
		}, "PUT", true);
	}
};
AppServices.User.sendUnitManagerDeviceTokenToServer = function(info) {
	var role = "UNITMGR";
	if (Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO)) {
		role = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO).user.role;
	}
	
	var url = "";
//	alert(info.unitmanagerdetails.company_id + "****" + info.unitmanagerdetails.id);
	url = apiUrl+"companies/"+info.unitmanagerdetails.company_id+"/units/"+info.unitmanagerdetails.id;
	
	Ti.API.info("Unit manager service url-------->"+url);
	
	if (Alloy.Globals.getData("deviceId") && (Alloy.Globals.getData("deviceId") != "")) {
		var requesData = {
			"device_id" : Alloy.Globals.getData("deviceId")
			//"user_email" : (role == "CUSTOMER") ? "sapna.sharma@oodlestechnologies.com" : "pankaj.kumar@oodlestechnologies.com"
		};
		serviceUtility.post(url, requesData, function(e) {
			Ti.API.info('post response:: for update device token for unit manager' + JSON.stringify(e));
		}, function(e) {
			Ti.API.info('post error response:: for update device token unit manager' + e);
		}, "PUT", true);
	}
};
AppServices.Consumer.sendOrderCreationConfirmation = function(params, callback) {
	var url = "http://6f8efd0e.ngrok.io/push/eventTrack";
	serviceUtility.post(url, params, function(e) {
		Ti.API.info('post response:: sendOrderCreationConfirmation' + JSON.stringify(e));
		callback(e);
	});
};

AppServices.Consumer.getSumUpCheckoutId = function(params, callback) {
	var url = "http://6f8efd0e.ngrok.io/oauth/payment/token";
	serviceUtility.post(url, params, function(e) {
		Ti.API.info('post response:: getSumUpCheckoutId' + JSON.stringify(e));
		callback(e);
	});
};

AppServices.Vendor.acceptOrder = function(params, callback) {
	var url = "http://6f8efd0e.ngrok.io/push/orderAcceptDeclice";
	serviceUtility.post(url, params, function(e) {
		Ti.API.info('post response:: for accept order' + JSON.stringify(e));
		callback();
	});
};

AppServices.Consumer.makePaymentToSumUp = function(params, paymnetSuccessCallback, paymnetErrorCallback) {
	var url = "https://api.sumup.com/v0.1/checkouts/" + params.checkoutId + "?otp=" + params.otp;
	serviceUtility.post(url, JSON.stringify(params.requestData), function(e) {
		Ti.API.info('post success response:: for makePaymentToSumUp' + JSON.stringify(e));
		paymnetSuccessCallback(e);
	}, function(e) {
		Ti.API.info('post error response:: for makePaymentToSumUp' + e);
		paymnetErrorCallback();
	}, "PUT", true);
};

AppServices.Consumer.makeDummyPaymentToMoltin = function(params) {
	var url = "https://api.molt.in/v1/checkout/payment/purchase/" + params.orderId;
	serviceUtility.post(url, params.requestData, function(e) {
		Ti.API.info('post response:: for makePaymentToMoltin' + JSON.stringify(e));
	});
};

AppServices.Vendor.GetFoodParks = function(callback) {
	var url = apiUrl + "food_parks";
	serviceUtility.get(url, function(e) {
		Ti.API.info('post response:: for GetFoodParks:: ' + JSON.stringify(e));
		if (e.length > 0) {
			callback(e);
		} else {
			var emptyArray = [];
			callback(emptyArray);
		}
	});
};
AppServices.Vendor.getSitesListData = function(params, callback) {
	//var url = "198.199.86.137:1337/api/v1/rel/mapsearch?latitude=" + params.latitude + "&longitude=" + params.longitude + "&distance=" + params.distance + "&time=" + params.date;
	var url = apiUrl + "mapsearch?latitude=" + params.latitude + "&longitude=" + params.longitude + "&distance=" + params.distance;
	//var url = "http://198.199.86.137:1337/api/v1/rel/mapsearch?latitude=-5.788104&longitude=-35.189276&distance=10";
	serviceUtility.get(url, function(e) {
		Ti.API.info('post response:: for getSitesListData' + JSON.stringify(e));
		callback(e);
	});
};

AppServices.Vendor.getCompany = function(_id, callback) {
	var url = apiUrl + "companies?user_id=" + _id;
	serviceUtility.get(url, function(e) {
		Ti.API.info('post response:: for getCompany' + JSON.stringify(e));
		callback(e);
	});
};
AppServices.Vendor.getUnit = function(_id, callback) {
	var url = apiUrl + "units?unit_mgr_id=" + _id;
	serviceUtility.get(url, function(e) {
		Ti.API.info('post response:: for getunit' + JSON.stringify(e));
		callback(e);
	});
};
AppServices.Vendor.checkIn = function(params, callback) {
	var url = apiUrl + "checkins";
	serviceUtility.post(url, params, function(e) {
		Ti.API.info('post response:: for checkIn' + JSON.stringify(e));
		callback(e);
	});
};

AppServices.Vendor.getOrders = function(callback) {
	var url = "https://api.molt.in/v1/orders?company=1293768990807556920&status=paid";
	//TODO make company id dynamic
	serviceUtility.get(url, function(e) {
		Ti.API.info('get response:: for orders' + JSON.stringify(e));
		if (e.result.length > 0) {
			callback(e.result);
		} else {
			callback([]);
		}
	});
};

AppServices.Vendor.getOrderItems = function(orderId, callback) {
	var url = "https://api.molt.in/v1/orders/" + orderId + "/items";
	//TODO make company id dynamic
	serviceUtility.get(url, function(e) {
		Ti.API.info('get response:: for getOrderItems' + JSON.stringify(e));
		if (e.result.length > 0) {
			callback(e.result);
		} else {
			callback([]);
		}
	});
};
AppServices.Vendor.getLoyaltyRewards = function(company_id,callback) {
	/*var url = "http://198.199.86.137:1337/api/v1/rel/companies/1001/loyalty_rewards";*/
	var url = "http://198.199.86.137:1337/api/v1/rel/loyalty_rewards?company_id="+company_id;
	//TODO make company id dynamic
	serviceUtility.get(url, function(e) {
		Ti.API.info('get response:: for orders' + JSON.stringify(e));
		//callback(JSON.stringify(e));
		callback(e);
		/*
		if (e.result.length > 0) {
			callback(e.result);
		} else {
			callback([]);
		}*/
	});
};
AppServices.Vendor.GET_ALL_LOYALTY_REWARDS = function(callback) {
	var url = "http://198.199.86.137:1337/api/v1/rel/loyalty_rewards";
	//TODO make company id dynamic
		serviceUtility.get(url, function(e) {
		Ti.API.info('get all loyalty rewards::' + JSON.stringify(e));
			callback(e);

	});
};




module.exports = AppServices;
