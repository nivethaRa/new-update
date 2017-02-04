Alloy.Globals.Cloud.Objects.query({
	classname : 'Tags'
}, function(e) {
	if (e.success) {
		var cloudTags = [];
		for (var i = 0; i < e.Tags.length; i++) {
			cloudTags.push(e.Tags[i].tag_name);
		};
		$.tagWidget.init(cloudTags);
	}
});

$.searchButton.addEventListener("click", function() {
	toggleSearch();
	loadLocation();
});

$.distanceLabel.text = L('distance0');

$.distanceSlider.addEventListener('change', function(e) {
	var sliderValue = parseFloat(e.value);
	if (sliderValue < 0.10) {
		$.distanceLabel.text = L('distance0');
	} else if (sliderValue < 0.45) {
		$.distanceLabel.text = L('distance1');
	} else if (sliderValue < 0.70) {
		$.distanceLabel.text = L('distance2');
	} else if (sliderValue < 0.90) {
		$.distanceLabel.text = L('distance3');
	} else {
		$.distanceLabel.text = L('distance4');
	}
});

function loadPlaces() {
	var w = {};
	if ($.tagWidget.getSelectedTags() != undefined && $.tagWidget.getSelectedTags().length > 0) {
		w.tags = {
			'$all' : $.tagWidget.getSelectedTags()
		};
	}
	if ($.pricingPicker.getSelectedRow(0) != undefined && $.pricingPicker.getSelectedRow(0).value != 0) {
		w.foodtruck_pricing = $.pricingPicker.getSelectedRow(0).value;

	}
	//distance in radians:
	//distance in km/6371 (earth medium radius)
	var sliderValue = parseFloat($.distanceSlider.value);
	if (sliderValue < 0.10) {
		distance = 0.015;
		// = 100/6371
	} else if (sliderValue < 0.45) {
		distance = 0.00031;
		// = 2/6371
	} else if (sliderValue < 0.70) {
		distance = 0.00078;
		// = 5/6371
	} else if (sliderValue < 0.90) {
		distance = 0.00156;
		// = 10/6371
	} else {
		distance = 0.00235;
		// = 15/6371
	}
	w.checkinFinishTime = {
		'$gte' : finishTime
	}, w.lnglat = {
		'$nearSphere' : [latitude, longitude],
		'$maxDistance' : distance
	};
	Alloy.Globals.Cloud.Checkins.query({
		where : w
	}, function(e) {
		if (e.success) {

			var pinViews = [];
			var tableData = [];

			for (var i = 0; i < e.checkins.length; i++) {
				//console.log(e.checkins[i].custom_fields)
				var checkin = e.checkins[i];

				var button = Ti.UI.createButton({
					title : L("details"),
					width : 100,
					height : 50,
					uid : checkin.user_id
				});

				//Details action on iphone must be in the button not in the pin
				if (Ti.Platform.osname == 'iphone') {
					button.addEventListener('click', function(e) {
						Alloy.createController('profile', {
							user_id : e.source.uid
						}).getView().open();
					});
				}

				//CREATE MAP PIN
				var pinView = Alloy.Globals.Map.createAnnotation({
					latitude : checkin.custom_fields.coordinates[0][0],
					longitude : checkin.custom_fields.coordinates[0][1],
					title : checkin.custom_fields.placeName,
					//subtitle: "",
					rightView : button,
					pincolor : Alloy.Globals.Map.ANNOTATION_RED,
					uid : checkin.user_id
				});
				pinViews.push(pinView);

				//CREATE TABLE ROW
				var row = Ti.UI.createTableViewRow({
					className : 'forumEvent', // used to improve table performance
					rowIndex : i, // custom property, useful for determining the row during events
					layout : "vertical"
					//height: 50
				});

				var rowContent = $.UI.create('View', {
					classes : ["absoluteTableRow"],
				});

				var imageFT = $.UI.create('ImageView', {
					classes : ["imageFT"],
				});
				rowContent.add(imageFT);

				Alloy.Globals.Cloud.Photos.show({
					photo_id : checkin.custom_fields.photo_id
				}, function(e) {
					if (e.success) {
						var photo = e.photos[0];
						//Ti.API.info('Success:\n' + JSON.stringify(photo));
						imageFT.image = photo.urls.original;
					} else {
						//Ti.API.info('Error:\n' +
						//    ((e.error && e.message) || JSON.stringify(e)));
					}
				});

				var labelUserName = $.UI.create('Label', {
					classes : ["labelUserName"],
					text : checkin.custom_fields.placeName,
				});
				rowContent.add(labelUserName);

				var labelDetails = $.UI.create('Label', {
					classes : ["labelDetails"],
					text : checkin.message,
				});
				rowContent.add(labelDetails);

				row.add(rowContent);
				row.addEventListener("click", function(e) {

					$.mainScrollableView.scrollToView($.mainView);

					var c = {};
					c.latitude = pinViews[e.row.rowIndex].latitude;
					c.longitude = pinViews[e.row.rowIndex].longitude;
					c.latitudeDelta = 0.05;
					c.longitudeDelta = 0.05;
					mapview.region = c;
				});
				tableData.push(row);

			}
			$.listTable.data = tableData;
			mapview.annotations = pinViews;
			hideLoading();
			if (pinViews.length == 0) {
				showTimingInfo(L("noFoodTruckFound"), 3);
			} else {
				showTimingInfo(L("selectTheFoodTruck"), 3);
			}
		} else {
			hideLoading();
			alert(L("placesLocationError"));
		}
	});
}