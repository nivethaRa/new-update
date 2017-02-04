//
// if (Ti.App.Properties.getString("myhome") == "MMF") {
// fstHomeRadioCliked();
// } else {
// sndHomeRadioCliked();
// }
function Radio1Cliked() {
	$.sndRadio.image = "/images/radio_off.png";
	$.trdRadio.image = "/images/radio_off.png";
	$.fstRadio.image = "/images/radio_on.png";
}

function Radio2Cliked() {
	$.fstRadio.image = "/images/radio_off.png";
	$.trdRadio.image = "/images/radio_off.png";
	$.sndRadio.image = "/images/radio_on.png";
}

function Radio3Cliked() {
	$.fstRadio.image = "/images/radio_off.png";
	$.sndRadio.image = "/images/radio_off.png";
	$.trdRadio.image = "/images/radio_on.png";
}

function UpdateCheckBox(e) {
	if (!e.source.idCheck) {
		e.source.idCheck = true;
		e.source.image = "/images/check_on.png";
	} else {
		e.source.idCheck = false;
		e.source.image = "/images/check_off.png";
	}
}

function weekBtnClicked(e) {
	if (!e.source.idCheck) {
		e.source.idCheck = true;
		e.source.color = "#FFF";
		e.source.backgroundColor = Alloy.Globals.buttonColor2;
	} else {
		e.source.idCheck = false;
		e.source.backgroundColor = Alloy.Globals.mapsBackgroundColor;
		e.source.color = Alloy.Globals.darkTextColor;
	}
}

function stepOneNext() {
	$.viewOne.visible = false;
	$.viewThree.visible = false;
	$.viewFour.visible = false;
	$.viewTwo.visible = true;
}

function stepTwoNext() {
	$.viewOne.visible = false;
	$.viewTwo.visible = false;
	$.viewFour.visible = false;
	$.viewThree.visible = true;
}

function stepThreeNext() {
	$.viewOne.visible = false;
	$.viewTwo.visible = false;
	$.viewThree.visible = false;
	$.viewFour.visible = true;
}

function stepFourNext() {
	// $.viewTwo.visible = false;
	// $.viewThree.visible = false;
	// $.viewFour.visible = false;
	// $.viewOne.visible = true;
	//Alloy.Globals.baseHomeView.add(Alloy.createController('/foodtruck/registration/preview').getView());
	var previewControl = Alloy.createController('/foodtruck/registration/preview').getView();
	previewControl.open();
}

var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "venuePic");
if (f.exists()) {
	$.vanuePic.image = f.nativePath;
}

var f2 = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "favDishPic");
if (f2.exists()) {
	$.favDishPic.image = f2.nativePath;
}

function setVenuePic(e) {
	Alloy.Globals.openMedia("venuePic", e.source);
}

function setFavDish(e) {
	Alloy.Globals.openMedia("favDishPic", e.source);
}

