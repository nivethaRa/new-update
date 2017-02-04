var footer = require('bottomtabs');
$.editReviewWin.add(footer.createFooter());
$.editReviewWin.barColor = Alloy.Globals.navBarColor;
$.editReviewWin.navTintColor = "white";

function closeEditReviewWin(e) {
	$.editReviewWin.close();
}

function fstRadioCliked() {
	$.sndRadio.image = "/images/radio_off.png";
	$.fstRadio.image = "/images/radio_on.png";
}

function sndRadioCliked() {
	$.fstRadio.image = "/images/radio_off.png";
	$.sndRadio.image = "/images/radio_on.png";
}

function fstSaucesRadioCliked() {
	$.sasSndRadio.image = "/images/radio_off.png";
	$.sasFstRadio.image = "/images/radio_on.png";
}

function sndSaucesRadioCliked() {
	$.sasFstRadio.image = "/images/radio_off.png";
	$.sasSndRadio.image = "/images/radio_on.png";
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

var f2 = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "editReviewPic");
if (f2.exists()) {
	$.editReviewPic.image = f2.nativePath;
}

function setPicture(e) {
	Alloy.Globals.openMedia("editReviewPic", e.source);
}

