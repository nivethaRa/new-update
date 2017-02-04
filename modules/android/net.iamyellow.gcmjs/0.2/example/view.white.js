/*global Ti: true, alert: true, require: true, setInterval: true, module: true*/

(function (API) {

	var window = Ti.UI.createWindow({
		navBarHidden: true,
		backgroundColor: 'white'
	}),
	opened = false;
	window.addEventListener('close', function () {
		opened = false;
	});

	var label = Ti.UI.createLabel({
		color: 'black', text: '',
		left: 10, right: 10
	});
	window.add(label);

	// ****************************************************************************************************************
	// ****************************************************************************************************************
	// module API

	API.show = function (str) {
		label.text = 'Notification received: ' + str;
		if (!opened) {
			opened = true;
			window.open();
		}
	};

})(module.exports);