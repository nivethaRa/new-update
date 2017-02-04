/*global Ti: true, alert: true, require: true, setInterval: true, module: true*/

(function (API) {

	var window = Ti.UI.createWindow({
		backgroundColor: 'yellow',
		navBarHidden: true,
		exitOnClose: true	
	}),
	opened = false;

	window.addEventListener('open', require('controller').onGuiReady);

	// ****************************************************************************************************************
	// ****************************************************************************************************************
	// module API

	API.show = function () {
		if (!opened) {
			opened = true;
			window.open();
		}
	};

})(module.exports);