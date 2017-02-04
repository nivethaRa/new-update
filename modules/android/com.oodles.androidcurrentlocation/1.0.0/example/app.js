
 var locationModule = require('com.oodles.androidcurrentlocation');


        var hasLocationReceived = false;

		// For android 6.0, ask user for location permission
    	if (!Titanium.Geolocation.hasLocationPermissions(Titanium.Geolocation.AUTHORIZATION_ALWAYS)) {
    		Titanium.Geolocation.requestLocationPermissions(Titanium.Geolocation.AUTHORIZATION_ALWAYS, function(result) {
    			if (result.success) {
    				performErrorHandling();
    			} else {
    				alert('Location permission denied');
    			}
    		});
    	} else {
    		performErrorHandling();
    	}


    	function performErrorHandling() {
        	try {
        		if(!Titanium.Geolocation.locationServicesEnabled) {
        				throw ('Please turn on location on your phone');
        		} else{
        				if (Titanium.Geolocation.locationServicesEnabled) {
        					inititateToFetchLocation();
        			    }
        		}
        	} catch(errorMessage) {
        			Ti.API.error("errorMessage :" + errorMessage);
        			return;
        	}
        }


	function inititateToFetchLocation() {
		try {
			locationModule.getUserLocation();
			_.delay(function() {
				if (!hasLocationReceived) {
					alert('Location is currently undetected');
				}
			}, 60 * 1000);
		} catch(errorMessage) {
			alert('Location is currently undetected');
			return;
		}
	}


	locationModule.addEventListener('complete', function(e) {
		Ti.API.info('Result: ' + (e.success ? 'success' : 'failure'));
		switch (e.result) {
		case locationModule.RECEIVED:
			hasLocationReceived = true;
			Ti.API.info('Location result: ' + e.latitude + " " + e.longitude + " " + e.isMock);
			if (e.isMock) {
                alert("Please disable mock locations first");
			} else {
				alert("Location is ", +e.latitude+', '+e.longitude);
			}
			break;
		case locationModule.FAILED:
			alert('Location is currently undetected');
			break;
		}
	});


	//reverse geolocations
	require('com.oodles.androidcurrentlocation').getAddressFromLocation({
    		success : function(e) {
    			Ti.API.info("********success************* "+e.address);
    		},
    		error : function(d) {
    			Ti.API.info("********error*************");
    		},
    		latitude : 28.4169605,
    		longitude : 77.0391642
    });