Alloy.Globals.applyLabelToTextField($.email, "email_example");

fstHomeRadioCliked();

if (Ti.App.Properties.getString("myhome") == "MMF") {
	fstHomeRadioCliked();
}

function fstRadioCliked() {
	$.sndRadio.image = "/images/radio_off.png";
	$.fstRadio.image = "/images/radio_on.png";
}

function fstHomeRadioCliked() {;
	$.fstHRadio.image = "/images/radio_on.png";
	Ti.App.Properties.setString("myhome", "MMF");
}

function UpdateCheckBox(e) {

	Ti.API.info('APIn  ' + JSON.stringify(e));
	if (!e.source.idCheck) {
		e.source.idCheck = true;
		e.source.image = "/images/check_on.png";
	} else {
		e.source.idCheck = false;
		e.source.image = "/images/check_off.png";
	}

}

