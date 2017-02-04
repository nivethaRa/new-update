var Alloy = require('alloy'),
    _ = require("alloy/underscore")._,
    SFEZKeys = require("SFEZKeys");

function getRole() {
	var role = "";
	if (Ti.App.Properties.getString(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO)) {
		Ti.API.info("*******************getRole*****1*************** " + Ti.App.Properties.getString(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO));
		var userData = Ti.App.Properties.getString(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO);
		userData = JSON.parse(userData);
		Ti.API.info("*******************userData******************** " + userData.token);
		Alloy.Globals.JWTToken = userData.token;
		role = userData.user.role;
	}
	(role == "") && ( role = "CUSTOMER");
	return role;
}

// HTTP client for get data
exports.get = function(url, callback) {
	Ti.API.info('URL---------->  ' + url);
	if (Ti.Network.online) {
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				var response = JSON.parse(this.responseText);
				callback(response);
			},
			onerror : function(e) {
				Alloy.Globals.loading.hide();
				alert(e);
			},
			timeout : 40000
		});
		client.open("GET", url);
		Ti.API.info("*****************getRole()**************** " + getRole());
		var key = (getRole() == "CUSTOMER") ? SFEZKeys.KEYS.CUSTOMER_ACCESS_TOKEN : SFEZKeys.KEYS.VENDOR_ACCESS_TOKEN;
		var access_token = "";
		if (Ti.App.Properties.getString(key)) {
			access_token = Ti.App.Properties.getString(key);
		}
		Ti.API.info("*****************access token**************** " + access_token);
		if (access_token != "") {
			client.setRequestHeader('AUTHORIZATION', 'Bearer ' + access_token);
			Ti.API.info('AUTHORIZATION' + "@@"+ access_token);
		}
		client.send();
	} else {
		alert("Please check your internet connection");
	}
};

// HTTP client for post data
exports.post = function(url, data, successCallback, errorCallback, method, isHeader) {
	Ti.API.info("**************service utility********* " + JSON.stringify(data));
	Ti.API.info("**************service utility urlllll********* " + url);
	var method = method ? method : "POST";
	if (Ti.Network.online) {
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				var response = JSON.parse(this.responseText);
				successCallback(response);
			},
			onerror : function(e) {
				Ti.API.error("FROM NETWORK API>>>" + this.responseText);
				Alloy.Globals.loading.hide();
				if (errorCallback) {
					errorCallback(this.responseText);
				} else {
					e.error && alert(e.error);
				}
			},
			timeout : 40000
		});
		client.open(method, url);
		Ti.API.info("*****************getRole()**************** " + getRole());
		var key = (getRole() == "CUSTOMER") ? SFEZKeys.KEYS.CUSTOMER_ACCESS_TOKEN : SFEZKeys.KEYS.VENDOR_ACCESS_TOKEN;
		var access_token = "";
		if (Ti.App.Properties.getString(key)) {
			access_token = Ti.App.Properties.getString(key);
		}
		//Ti.API.info("*****************access token**************** " + access_token);'
		if (isHeader) {
			//client.setRequestHeader('Content-Type', 'application/json');
			client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		if(method == "PUT"){
			Ti.API.info("*****************JWTToken**************** " + Alloy.Globals.JWTToken);
			
			client.setRequestHeader('Authorization', " "+Alloy.Globals.JWTToken);
			//client.setRequestHeader('Authorization', 'Bearer ' + access_token);
		}
		else if (access_token != "" && (method != "PUT")) {
			Ti.API.info(method + ":: "+ 'Bearer ' + access_token);
			client.setRequestHeader('Authorization', 'Bearer ' + access_token);
		}
		Ti.API.info("data send in service:" + JSON.stringify(data));
		client.send(data);
	} else {
		alert("Please check your internet connection");
	}
};
