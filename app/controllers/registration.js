var SFEZKeys = require("SFEZKeys"),
    utils = require("utils"),
    moment = require('alloy/moment');

var isVendor = false;
$.company_name.visible = false;

Alloy.Globals.applyLabelToTextField($.first_name, "first_name");
Alloy.Globals.applyLabelToTextField($.last_name, "last_name");
Alloy.Globals.applyLabelToTextField($.email, "email_example");
Alloy.Globals.applyLabelToTextField($.password, "password", true);
Alloy.Globals.applyLabelToTextField($.password_confirmation, "password_confirmation", true);

$.loginLink.addEventListener("click", function() {
	//(Alloy.Globals.baseView) && Alloy.Globals.baseView.add(Alloy.createController('login').getView());
	utils.replaceCentralView({
		view : Alloy.createController('login').getView(),
		title : L('SignIn')
	});
	/*var loginControl = Alloy.createController('login').getView();
	 if (OS_ANDROID) {
	 loginControl.open();
	 } else {
	 Alloy.Globals.Nav.openWindow(loginControl);
	 }*/
});

function doFieldsBlur() {
	$.first_name.blur();
	$.last_name.blur();
	$.email.blur();
	$.password.blur();
	$.password_confirmation.blur();
}

function validateInputs() {
	if ($.first_name.value == "" || $.first_name.value == L("first_name") || $.last_name.value == "" || $.last_name.value == L("last_name") || $.email.value == "" || $.email.value == L("email_example") || $.password.value == "" || $.password.value == L("password") || $.password_confirmation.value == "" || $.password_confirmation.value == L("password_confirmation")) {
		Alloy.Globals.simpleAlert(L("incomplete_data"));
		return false;
	}
	if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($.email.value) == false) {
		Alloy.Globals.simpleAlert(L("invalid_email"));
		return false;
	}
	if ($.password_confirmation.value != $.password.value) {
		Alloy.Globals.simpleAlert(L("password_does_not_match_confirmation"));
		return false;
	}
	if ($.password.value.length < 4) {
		Alloy.Globals.simpleAlert(L("password_too_short"));
		return false;
	}

	return true;
}

function getUserDetail(registerResponse) {
	//TODO make company id and unit id dynamic
	console.log(registerResponse);
	var id = registerResponse.user.id;
	Alloy.Globals.Services.Vendor.getCompany(id, function(response) {
		var userInfo = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO);
		console.log("***** GET COMPANY ***** MAN");
		console.log(response);
		userInfo["company"] = response[0];
		userInfo["unit"] = "2001";
		Alloy.Globals.setData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO, userInfo);
		require("utils").replaceCentralView({
			view : Alloy.createController('/foodtruck/checkins/checkin_first').getView(),
			title : "Check In"
		});
	});
}

$.sign_up.addEventListener("click", function() {
	if (!validateInputs()) {
		return;
	}
	if(isVendor && $.company_name.value == ""){
		Alloy.Globals.simpleAlert("Vendor company name is required.");
		return;
	}
	$.sign_up.title = L("signing_up");
	$.sign_up.enabled = false;
	doFieldsBlur();
	var role = "CUSTOMER";
	if (isVendor) {
		role = "OWNER";
	}
	var lastRole = "";
	if (Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO)) {
		lastRole = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO).user.role;
	}
	var params = {
		"first_name" : $.first_name.value,
		"last_name" : $.last_name.value,
		"email" : $.email.value,
		"password" : $.password.value,
		"role" : role,
		"company_name": $.company_name.value
	};
	//isVendor && (params['company_name'] = "oodles" + moment().format("X"));
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
			getUserDetail(response);
		}
	}, function() {
		$.sign_up.title = L('sign_up');
		$.sign_up.enabled = true;
		Alloy.Globals.simpleAlert("Registration request failed.");
	});
});

function termsConditionClicked() {
	console.log("TERMS & CONDITION CLICKED");
	var webview = Titanium.UI.createWebView({
		url : 'http://www.streetfoodez.com.br/terms'
	});
	var window = Titanium.UI.createWindow();
	window.add(webview);
	window.open({
		modal : true
	});
}

function UpdateCheckBox(e) {
	if (!e.source.idCheck) {
		e.source.idCheck = true;
		e.source.image = "/images/check_on.png";
		isVendor = true;
		$.company_name.visible = true;
	} else {
		e.source.idCheck = false;
		e.source.image = "/images/check_off.png";
		isVendor = false;
		$.company_name.visible = false;
	}
}
