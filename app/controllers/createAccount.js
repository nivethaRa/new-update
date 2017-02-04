var SFEZKeys = require("SFEZKeys"),
    utils = require("utils"),
    moment = require('alloy/moment');
var facebookLoginButton = Alloy.Globals.Facebook.createLoginButton();
var isVendor = false;
//$.win.barColor = Alloy.Globals.navBarColor;
//$.win.navTintColor = "white";

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

								Alloy.Globals.registerGlobalChanelPush();
								Alloy.createController('home').getView().open();
								$.index.close();

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
// Alloy.Globals.Facebook.addEventListener('login', updateLoginStatus);

$.othersLogin.add(facebookLoginButton);

Alloy.Globals.applyLabelToTextField($.fName, "first_name");
Alloy.Globals.applyLabelToTextField($.username, "last_name");
Alloy.Globals.applyLabelToTextField($.email, "email_example");
Alloy.Globals.applyLabelToTextField($.password, "password", true);

function validateInputs() {
	if ($.fName.value == "" || $.fName.value == L("email_example") || $.username.value == "" || $.username.value == L("username") || $.email.value == "" || $.email.value == L("email_example") || $.password.value == "" || $.password.value == L("password")) {
		Alloy.Globals.simpleAlert(L("incomplete_data"));
		return false;
	}
	return true;
}

$.fstRadio.image = "/images/radio_on.png";
function fstRadioCliked() {
	isVendor = false;
	$.sndRadio.image = "/images/radio_off.png";
	$.fstRadio.image = "/images/radio_on.png";
}

function sndRadioCliked() {
	isVendor = true;
	$.fstRadio.image = "/images/radio_off.png";
	$.sndRadio.image = "/images/radio_on.png";
}

function validateInputs() {
	if ($.fName.value == "" || $.username.value == "" || $.email.value == "" || $.email.value == L("email_example") || $.password.value == "" || $.password.value == L("password")) {
		Alloy.Globals.simpleAlert(L("incomplete_data"));
		return false;
	}
	return true;
}

function doFieldsBlur() {
	$.fName.blur();
	$.username.blur();
	$.email.blur();
	$.password.blur();
}

function createAccoutClicked() {
	if (!validateInputs()) {
		return;
	}
	doFieldsBlur();
	$.login.title = "Please wait...";
	$.login.enabled = false;
	var role = "CUSTOMER";
	if (isVendor) {
		role = "OWNER";
	}
	var lastRole = "";
	if (Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO)) {
		lastRole = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO).user.role;
	}
	var params = {
		"first_name" : $.fName.value,
		"last_name" : $.username.value,
		"email" : $.email.value,
		"password" : $.password.value,
		"role" : role
	};
	isVendor && (params['company_name'] = "oodles" + moment().format("X"));
	//added hardcoded for now as its a required field
	Ti.API.info("************params************ " + JSON.stringify(params));
	Alloy.Globals.Services.User.Register(params, function(response) {
		response && Alloy.Globals.setData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO, response);
		if (role == "CUSTOMER") {
			if (lastRole == "OWNER") {
				//logic to switch bottom tabs
				Alloy.Globals.mainView.baseView.removeAllChildren();
				Alloy.Globals.mainView.baseView.add(require('bottomtabs').createConsumerFooter("CUSTOMER"));
			}
			utils.replaceCentralView({
				view : Alloy.createController('mapmyfood').getView(),
				title : L('MapMyFood')
			});
		} else if (role == "OWNER") {
			if (lastRole == "" || lastRole == "CUSTOMER") {
				//logic to switch bottom tabs
				Alloy.Globals.mainView.baseView.removeAllChildren();
				Alloy.Globals.mainView.baseView.add(require('bottomtabs').createConsumerFooter("OWNER"));
			}
			utils.replaceCentralView({
				view : Alloy.createController('/foodtruck/checkins/checkin_first').getView(),
				title : "Check In"
			});
		}
	}, function() {
		$.login.title = L('createAccount');
		$.login.enabled = true;
		Alloy.Globals.simpleAlert("Registration request failed.");
	});
}

/*
 if(Alloy.Globals.Cloud.sessionId && Ti.App.Properties.getString("session_id") ) {
 Alloy.createController('home').getView().open();
 $.index.close();
 } else {
 $.index.open();
 }
 */
