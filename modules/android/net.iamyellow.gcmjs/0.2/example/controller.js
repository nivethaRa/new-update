/*global Ti: true, alert: true, require: true, setInterval: true, module: true*/

(function (API) {

	// ****************************************************************************************************************
	// ****************************************************************************************************************
	// private helpers

	function log (msg) {
		Ti.API.info('>>> ' + msg);
	}

	// ****************************************************************************************************************
	// ****************************************************************************************************************
	// module API

	API.start = function () {
		log('App has started.');

		require('view.main').show();
	};

	API.onGuiReady = function () {
		log('GUI is ready, start GCM regitration.');

		var gcm = require('lib.gcm'),
		pendingData = gcm.getData();

		if (pendingData !== null) {
			log('GCM: has pending data on START. Data is:');
			log(JSON.stringify(pendingData));

			require('view.green').show(pendingData);
		}

		gcm.doRegistration({
			success: function (ev) {
				log('GCM success, deviceToken = ' + ev.deviceToken);
			},
			error: function (ev) {
				log('GCM error = ' + ev.error);
			},
			callback: function (data) {
				var dataStr = JSON.stringify(data);

				log('GCM notification while in foreground. Data is:');
				log(dataStr);

				require('view.white').show(dataStr);
			},
			unregister: function (ev) {
				log('GCM: unregister, deviceToken =' + ev.deviceToken);
			},
			data: function (data) {
				log('GCM: has pending data on RESUME. Data is:');
				log(JSON.stringify(data)); // 'data' parameter = gcm.data

				require('view.green').show(data);
			}
		});
	};

})(module.exports);