var locationModule = require('com.oodles.androidcurrentlocation');
exports.getCurrentLocation = function(params) {
	var isLocationReceived = false;

	function showErrorMessage() {
		alert(L('location_unavailable'));
	}

	function inititateToFetchLocation() {
		try {
			locationModule.getUserLocation({
				success : function(e) {
					Ti.API.info("*****getUserLocation***success*************");
					isLocationReceived = true;
					if (e.isMock) {
						params.callBack({
							fromMock : e.isMock
						});
					} else {
						params.callBack({
							latitude : e.latitude,
							longitude : e.longitude,
						});
					}
				},
				error : function(d) {
					Ti.API.info("***getUserLocation*****error*************");
					isLocationReceived = true;
					showErrorMessage();
				},
			});
			_.delay(function() {
				if (!isLocationReceived) {
					showErrorMessage();
				}
			}, 60 * 1000);
		} catch(errorMessage) {
			Ti.API.error("errorMessage :" + errorMessage);
			showErrorMessage();
			return;
		}
	}

	function performErrorHandling() {
		try {
			if (!Titanium.Geolocation.locationServicesEnabled) {
				throw (L('turn_on_location'));
			} else {
				if (Titanium.Geolocation.locationServicesEnabled) {
					inititateToFetchLocation();
				}
			}
		} catch(errorMessage) {
			Ti.API.error("errorMessage :" + errorMessage);
			params.callBack(errorMessage);
			return;
		}
	}

	// For android 6.0, ask user for location permission
	if (!Titanium.Geolocation.hasLocationPermissions(Titanium.Geolocation.AUTHORIZATION_ALWAYS)) {
		Titanium.Geolocation.requestLocationPermissions(Titanium.Geolocation.AUTHORIZATION_ALWAYS, function(result) {
			if (result.success) {
				performErrorHandling();
			} else if (OS_ANDROID) {
				alert(L('denied_location_permission'));
			} else {
				alert(L('denied_location_permission'));
			}
		});
	} else {
		performErrorHandling();
	}
};
