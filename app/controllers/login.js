var SFEZKeys = require("SFEZKeys"),
    utils = require("utils");
//Alloy.Globals.Facebook.permissions = [FACEBOOK_APP_PERMISSIONS];
//Alloy.Globals.generateDeviceToken();
Alloy.Globals.Facebook.initialize();

/*$.windowSignIn.barColor = Alloy.Globals.navBarColor;
 $.windowSignIn.navTintColor = "white";
 $.windowSignIn.backgroundColor = Alloy.Globals.windowBackgroundLight;*/

if (OS_ANDROID) {
	function closeWin(evt) {
		$.getView().close();
	}

}

$.getView().addEventListener('close', function() {
	// Let the tabgroup know that a focus event has occurred
	// in case the parent tab needs to be refreshed
	Alloy.Globals.tabConsumer.fireEvent('focus');
});

function closeWindow() {
	Alloy.Globals.Nav.close();
}

if (OS_ANDROID) {
	$.login.fbProxy = Alloy.Globals.Facebook.createActivityWorker({
		lifecycleContainer : $.login
	});
}
var facebookLoginButton = Alloy.Globals.Facebook.createLoginButton();

function updateLoginStatus(e) {
	if (Alloy.Globals.Facebook.loggedIn) {
		facebookLoginButton.setVisible(false);
		$.login.title = L("authenticating");
		Alloy.Globals.Cloud.SocialIntegrations.externalAccountLogin({
			type : 'facebook',
			token : Alloy.Globals.Facebook.accessToken
		}, function(e) {
			if (e.success) {
				Alloy.Globals.Facebook.requestWithGraphPath('me', {
					fields : "id,name,email"
				}, 'GET', function(e) {
					if (e.success) {
						//Ti.API.info(JSON.stringify(e.result));
						var result = JSON.parse(e.result);
						var email,
						    first_name,
						    last_name;

						first_name = result.name.substring(0, result["name"].indexOf(" "));
						last_name = result.name.substring(result["name"].indexOf(" ") + 1);
						email = result["email"];

						Alloy.Globals.Cloud.Users.update({
							email : email,
							first_name : first_name,
							last_name : last_name,
						}, function(e) {
							if (e.success) {

								var user = e.users[0];
								//Ti.API.info('Success:\n' +
								//    'id: ' + user.id + '\n' +
								//    'first name: ' + user.first_name + '\n' +
								//    'last name: ' + user.last_name);

								Ti.App.Properties.setString("session_id", Alloy.Globals.Cloud.sessionId);
								Ti.App.Properties.setString("facebook_id", result.id);

								var xhr = Titanium.Network.createHTTPClient({
									onload : function() {
										//Ti.API.info(this.location);

										var xhr2 = Titanium.Network.createHTTPClient({
											onload : function() {
												var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'profile.jpg');
												if (f.write(this.responseData) === true) {// write to the file
													Ti.App.fireEvent('profileimage_downloaded', {
														filepath : f.nativePath
													});
												}
											}
										});
										xhr2.open('GET', this.location);
										xhr2.send();
									},
									// function called when an error occurs, including a timeout
									onerror : function(e) {
										Ti.API.debug(e.error);
									}
								});
								xhr.open('GET', "http://graph.facebook.com/" + result.id + "/picture?width=300&height=300");
								xhr.send();

								//Alloy.Globals.registerGlobalChanelPush();

								if (Ti.App.Properties.getString("myhome") == "MMF") {
									//Alloy.Globals.baseView.add(Alloy.createController('mapmyfood').getView());
								} else {
									//Alloy.Globals.baseView.add(Alloy.createController('favorites').getView());
								}

							} else {
								if (Alloy.Globals.Facebook.loggedIn) {
									Alloy.Globals.Facebook.logout();
									Alloy.Globals.Facebook.loggedIn = false;
								}

								Ti.App.Properties.setString("session_id", "");
								$.login.title = L("login");
								facebookLoginButton.setVisible(true);

								//Ti.API.info(JSON.stringify(e));
								Alloy.Globals.simpleAlert(L("requsetFailure") + "\n" + ((e.error && e.message) || JSON.stringify(e)));
							}
						});

					} else {
						//Ti.API.info(JSON.stringify(e));
						$.login.title = L("login");
						facebookLoginButton.setVisible(true);
						alert(L("requsetFailure"));
					}
				});
			} else {
				//Ti.API.info(JSON.stringify(e));
				$.login.title = L("login");
				facebookLoginButton.setVisible(true);
				alert(L("requsetFailure"));
			}
		});
	} else {
		Alloy.Globals.simpleAlert('Please login to Facebook.');
	}
}

// when the user logs into or out of Facebook, link their login state with ArrowDB
Alloy.Globals.Facebook.addEventListener('login', updateLoginStatus);

$.othersLogin.add(facebookLoginButton);

function doRegister() {
	utils.replaceCentralView({
		view : Alloy.createController('registration').getView(),
		title : L('CreateAccount')
	});
};

Alloy.Globals.applyLabelToTextField($.email, "email_example");
Alloy.Globals.applyLabelToTextField($.password, "password", true);

function validateInputs() {
	if ($.email.value == "" || $.email.value == L("email_example") || $.password.value == "" || $.password.value == L("password")) {
		Alloy.Globals.simpleAlert(L("incomplete_data"));
		return false;
	}
	return true;
}

function getUserDetail(id) {
	//TODO make company id and unit id dynamic
	var id = id;
	Alloy.Globals.Services.Vendor.getCompany(id, function(response) {
		Ti.API.info('LOGIN RESPONSE' + JSON.stringify(response));
		var userInfo = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO);
		//alert(userInfo);
		//alert(JSON.stringify(response));
		userInfo["company"] = response[0];
		userInfo["unit"] = "2001";
		Alloy.Globals.setData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO, userInfo);
		require("utils").replaceCentralView({
			view : Alloy.createController('/foodtruck/checkins/checkin_first').getView(),
			title : "Check In"
		});
	});
}
function getUnitManagerDetails(id) {
	//TODO make company id and unit id dynamic
	var id = id;
	Alloy.Globals.Services.Vendor.getUnit(id, function(response) {
		Ti.API.info('LOGIN RESPONSE' + JSON.stringify(response));
		var userInfo = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO);
		//alert(userInfo);
		//alert(JSON.stringify(response));
		userInfo["unitmanagerdetails"] = response[0]; 
		userInfo["unit"] = id;
		Ti.API.info("SFEZKeys.KEYS.LOGGED_IN_USERS_INFO:" + JSON.stringify(userInfo));
		Alloy.Globals.setData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO, userInfo);
		require("utils").replaceCentralView({
			view : Alloy.createController('/foodtruck/checkins/checkin_first').getView(),
			title : "Check In"
		});
		Alloy.Globals.Services.User.sendUnitManagerDeviceTokenToServer(userInfo);
	});
}
function getCustomerDetail(customerID){
	var id = customerID;
	Alloy.Globals.Services.Consumer.getCustomer(id, function(response) {
		Ti.API.info('getCustomerDetail RESPONSE' + JSON.stringify(response));
		var userInfo = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO);
		userInfo["company"] = response[0];
		userInfo["unit"] = "2001";
		Alloy.Globals.setData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO, userInfo);
		Ti.API.info("SFEZKeys.KEYS.LOGGED_IN_USERS_INFO:custtt " + JSON.stringify(userInfo));
		/*require("utils").replaceCentralView({
			view : Alloy.createController('/foodtruck/checkins/checkin_first').getView(),
			title : "Check In"
		});*/
		Alloy.Globals.Services.User.sendUserDeviceTokenToServer(response[0].id);
	});
}


function doLogin(e) {
	if (!validateInputs()) {
		return;
	}
	$.login.title = L("authenticating");
	$.login.enabled = false;
	$.email.blur();
	$.password.blur();
	var params = {
		username : $.email.value,
		password : $.password.value
	};
	var lastRole = "";
	if (Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO)) {
		lastRole = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO).user.role;
	}
	Alloy.Globals.Services.User.login(params, function(response) {
		response && Alloy.Globals.setData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO, response);
		//alert(response.user.role +"@@@id"+ response.user.id);
		Ti.API.info(JSON.stringify(response));
		if (response.user.role == "CUSTOMER") {
			if (lastRole == "OWNER" || response.user.role == "UNITMGR") {
				//logic to switch bottom tabs
				Alloy.Globals.mainView.baseView.removeAllChildren();
				Alloy.Globals.mainView.baseView.add(require('bottomtabs').createConsumerFooter("CUSTOMER"));
				Alloy.Globals.menuTable.removeAllChildren();
				Alloy.Globals.menuTable.setData(Alloy.Globals.getTableRows("CUSTOMER"));
			}
			utils.replaceCentralView({
				view : Alloy.createController('mapmyfood', {customerID : response.user.customer_id}).getView(),
				title : L('MapMyFood')
			});
			getCustomerDetail(response.user.id);
		} else if (response.user.role == "OWNER" || response.user.role == "UNITMGR") {
			if (lastRole == "" || lastRole == "CUSTOMER") {
				//logic to switch bottom tabs
				Alloy.Globals.mainView.baseView.removeAllChildren();
				Alloy.Globals.mainView.baseView.add(require('bottomtabs').createConsumerFooter("OWNER"));
				Alloy.Globals.menuTable.removeAllChildren();
				Alloy.Globals.menuTable.setData(Alloy.Globals.getTableRows("OWNER"));
			}
			if(response.user.role == "OWNER")
				getUserDetail(response.user.id);
			else if(response.user.role == "UNITMGR")
				getUnitManagerDetails(response.user.id);
		}
	}, function() {
		$.login.title = L('login');
		$.login.enabled = true;
		alert("Login request failed. Please check entered email and password.");
	});
}
