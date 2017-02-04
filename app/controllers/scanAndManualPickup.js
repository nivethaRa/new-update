var args = arguments[0] || {};
//Animation Durations
var smallDuration = 250;
var bigDuration = 250;
var normalDuration = 150;

//Animations Transformations
var small = Ti.UI.create2DMatrix({
	scale : 0.05
});
var big = Ti.UI.create2DMatrix({
	scale : 1.2
});
var normal = Ti.UI.create2DMatrix({
	scale : 1
});

//Open with Style
(function() {
	//Change the message of popup after getting value
	//Ti.API.info("you are not connected to internet");
	var proceedAnimations = function() {
		$.popupBox.animate({
			duration : bigDuration,
			transform : big
		}, function() {
			$.popupBox.animate({
				duration : normalDuration,
				transform : normal
			});
		});
	};
	if (OS_ANDROID) {
		$.hazeViewContainer.visible = false;
		$.popupBox.animate({
			duration : smallDuration,
			transform : small
		}, function() {
			$.hazeViewContainer.visible = true;
			proceedAnimations();
		});
		return;
	}
	$.popupBox.transform = small;
	proceedAnimations();
})();

//Close with Style
var closeWithStyle = function() {
	$.popupBox.animate({
		duration : 300,
		transform : big
	}, function() {
		$.popupBox.animate({
			duration : smallDuration,
			transform : small
		}, function() {
			$.hazeViewContainer.close();
		});
	});
};

function clickOutSide() {
	closeWithStyle();
}

if (OS_ANDROID) {
	function closeWin(evt) {
		$.getView().close();
	}

}