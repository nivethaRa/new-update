var facebookLoginButton = Alloy.Globals.Facebook.createLoginButton();
var isVendor = false;
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
Alloy.Globals.applyLabelToTextField($.lName, "last_name");
Alloy.Globals.applyLabelToTextField($.email, "email_example");

// Alloy.Globals.Cloud.Users.resendConfirmation({
//       email: "gustavosizilio@gmail.com",
//       from: 'register@streetfoodez.com'
//   }
//   , function(e) {
//     if (e.success) {
//       alert("SUCCESS");
//     } else {
//       Alloy.Globals.simpleAlert(FAIL + "\n" +
//             ((e.error && e.message) || JSON.stringify(e)));
//     }
//   });
/*
 $.login.addEventListener("click", function(){
 if(!validateInputs()){
 return;
 }
 $.login.title = L("authenticating");
 $.login.enabled = false;
 Alloy.Globals.Cloud.Users.login({
 login: $.email.value,
 password: $.password.value
 }, function (e) {
 if (e.success) {
 Ti.App.Properties.setString("session_id", Alloy.Globals.Cloud.sessionId);
 Alloy.Globals.registerGlobalChanelPush();
 Alloy.createController('home').getView().open();
 $.index.close();
 } else {
 Alloy.Globals.simpleAlert(L("login_fail") + "\n" +
 ((e.error && e.message) || JSON.stringify(e)));
 $.login.title = L("login");
 $.login.enabled = true;
 }
 });
 });
 */
function validateInputs() {
	if ($.email.value == "" || $.email.value == L("email_example") || $.password.value == "" || $.password.value == L("password")) {
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

function createAccoutTruckClicked() {
	if (!isVendor) {
		Ti.API.info('in first');
		Alloy.createController('home_truck').getView().close();
		Alloy.createController('home').getView().open();
	} else {
		Ti.API.info('in seciond');
		;
		Alloy.createController('home_truck').getView().open();
		Alloy.createController('home').getView().close();
	}
}

/*
 if(Alloy.Globals.Cloud.sessionId && Ti.App.Properties.getString("session_id") ) {
 Alloy.createController('home').getView().open();
 $.index.close();
 } else {
 $.index.open();
 }
 */