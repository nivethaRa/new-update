
function Radio1Cliked() {
	$.sndRadio.image = "/images/radio_off.png";
	$.fstRadio.image = "/images/radio_on.png";
}

function Radio2Cliked() {
	$.fstRadio.image = "/images/radio_off.png";
	$.sndRadio.image = "/images/radio_on.png";
}


function stepThreeNext() {
	$.viewThree.visible = false;
}

function searchPrefClicked() {
	// $.viewTwo.visible = false;
	// $.viewThree.visible = false;
	// $.viewFour.visible = false;
	// $.viewOne.visible = true;
	// Alloy.Globals.baseHomeView.add(Alloy.createController('/foodtruck/registration/preview').getView());
}

$.orderSlider.addEventListener('change', function(e) {
	var sliderValue = parseFloat(e.value);
	// if (sliderValue < 0.10) {
		// $.distanceLabel.text = L('distance0');
	// } else if (sliderValue < 0.45) {
		// $.distanceLabel.text = L('distance1');
	// } else if (sliderValue < 0.70) {
		// $.distanceLabel.text = L('distance2');
	// } else if (sliderValue < 0.90) {
		// $.distanceLabel.text = L('distance3');
	// } else {
		// $.distanceLabel.text = L('distance4');
	// }
});

$.prepTimeSlider.addEventListener('change', function(e) {
	var sliderValue = parseFloat(e.value);
	// if (sliderValue < 0.10) {
		// $.distanceLabel.text = L('distance0');
	// } else if (sliderValue < 0.45) {
		// $.distanceLabel.text = L('distance1');
	// } else if (sliderValue < 0.70) {
		// $.distanceLabel.text = L('distance2');
	// } else if (sliderValue < 0.90) {
		// $.distanceLabel.text = L('distance3');
	// } else {
		// $.distanceLabel.text = L('distance4');
	// }
});

$.deliverySlider.addEventListener('change', function(e) {
	var sliderValue = parseFloat(e.value);
	// if (sliderValue < 0.10) {
		// $.distanceLabel.text = L('distance0');
	// } else if (sliderValue < 0.45) {
		// $.distanceLabel.text = L('distance1');
	// } else if (sliderValue < 0.70) {
		// $.distanceLabel.text = L('distance2');
	// } else if (sliderValue < 0.90) {
		// $.distanceLabel.text = L('distance3');
	// } else {
		// $.distanceLabel.text = L('distance4');
	// }
});
