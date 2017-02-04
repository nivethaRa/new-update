var back;
if (OS_ANDROID) {
	$.checkin.addEventListener('android:back', function(e) {
		if (back)
			back();
	});
}

var doCheckin = function() {
};

$.nextToDate.addEventListener("click", function() {
	$.scrollable.scrollToView($.setStartDate);
});
$.description.addEventListener("change", function() {
	enableNextToDate();
});

$.submitStartDate.addEventListener("click", function() {
	$.scrollable.scrollToView($.doCheckinView);
});

function enableNextToDate() {
	if ($.description.value != "") {
		$.nextToDate.enabled = true;
	} else {
		$.nextToDate.enabled = false;
	}
}

function disableNext() {
	$.nextToDate.enabled = false;
}

var currentDate,
    startDate,
    finishDate;
$.submitRequest.addEventListener("click", function() {
	currentDate = new Date();
	startDate = new Date();
	finishDate = new Date();

	finishDate.setSeconds(0, 0);
	finishDate.setHours($.checkinFinishTime.value.getHours());
	finishDate.setMinutes($.checkinFinishTime.value.getMinutes());

	startDate.setSeconds(0, 0);
	startDate.setHours($.checkinStartTime.value.getHours());
	startDate.setMinutes($.checkinStartTime.value.getMinutes());

	var nextDay = false;
	//Ti.API.info("INIT HOUR " + startDate.getHours());
	//Ti.API.info("FINISH HOUR " + finishDate.getHours());

	if (finishDate.getHours() < startDate.getHours()) {
		nextDay = true;
	} else if (finishDate.getHours() == startDate.getHours() && finishDate.getMinutes() < startDate.getMinutes()) {
		nextDay = true;
	}

	//Ti.API.info("IS NEXT DAY " + nextDay);

	if (nextDay) {
		finishDate.setDate(currentDate.getDate() + 1);
	} else {
		finishDate.setDate(currentDate.getDate());
	}

	doCheckin();
});

back = function() {
	if ($.scrollable.getCurrentPage() == 0) {
		$.checkin.close();
	} else if ($.scrollable.getCurrentPage() == 1) {
		$.scrollable.scrollToView($.startCheckinView);
	} else if ($.scrollable.getCurrentPage() == 2) {
		$.scrollable.scrollToView($.setStartDate);
	}
};

$.backMenuIconView.addEventListener("click", back);

$.useEvents.addEventListener("click", function() {
	disableNext();
	$.useEvents.title = L('locating');
	Ti.Geolocation.purpose = L('locationPurpose');
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			Alloy.Globals.simpleAlert(L('locationError'));
		} else {
			var c = e.coords;
			c.latitudeDelta = 0.05;
			c.longitudeDelta = 0.05;
			mapview.region = c;

			Alloy.Globals.Cloud.Events.query({
				where : {
					lnglat : {
						'$nearSphere' : [c.latitude, c.longitude],
						'$maxDistance' : 0.99
					}
				}
			}, function(e) {
				if (e.success) {
					var placeIds = [];
					var eventsPlaces = {};
					for (var i = 0; i < e.events.length; i++) {
						if (e.events[i].place_id) {
							placeIds.push(e.events[i].place_id);
							eventsPlaces[e.events[i].place_id] = e.events[i];
						}
					}

					Alloy.Globals.Cloud.Places.query({
						where : {
							id : {
								'$in' : placeIds
							}
						}
					}, function(e) {
						if (e.success) {
							var pinViews = [];
							for (var i = 0; i < e.places.length; i++) {
								var place = e.places[i];
								var pinView = Alloy.Globals.Map.createAnnotation({
									latitude : place.latitude,
									longitude : place.longitude,
									title : eventsPlaces[place.id].name,
									//subtitle: "",
									pincolor : Alloy.Globals.Map.ANNOTATION_RED,
									myid : eventsPlaces[place.id].id
								});
								pinViews.push(pinView);
							}
							mapview.annotations = pinViews;

							mapview.addEventListener("click", function(e) {
								if (e.clicksource == "pin") {
									enableNextToDate();
									doCheckin = function() {
										$.submitRequest.title = L("checkingIn");
										if ($.description.value == "") {
											alert(L("incomplete_data"));
											$.submitRequest.title = L("checkin");
											return;
										};

										Alloy.Globals.Cloud.Checkins.create({
											event_id : e.annotation.myid,
											message : $.description.value,
											custom_fields : {
												foodtruck_name : Alloy.Globals.currentUser.custom_fields.foodtruck_name,
												foodtruck_description : Alloy.Globals.currentUser.custom_fields.description,
												foodtruck_pricing : parseInt(Alloy.Globals.currentUser.custom_fields.pricing_range),
												photo_id : Alloy.Globals.currentUser.photo_id,
												tags : Alloy.Globals.currentUser.tags,
												coordinates : [e.annotation.latitude, e.annotation.longitude],
												placeName : e.annotation.title,
												checkinFinishTime : finishDate,
												checkinStartTime : startDate
											}
										}, function(e) {
											if (e.success) {
												Alloy.Globals.simpleAlert(L("checkinSuccess"), function() {
													$.checkin.close();
												});
											} else {
												Alloy.Globals.simpleAlert(L("checkinFailure"));
												$.submitRequest.title = L("checkin");
											}
										});
									};
								} else {
									disableNext();
								}
							});
							$.useEvents.title = L('useEvents');
						} else {
							$.useEvents.title = L('useEvents');
							alert(L("placesLocationError"));
						}
					});
				} else {
					alert(L("placesLocationError"));
				}
			});
		}
	});
});

$.usePlaces.addEventListener("click", function() {
	disableNext();
	$.usePlaces.title = L('locating');
	Ti.Geolocation.purpose = L('locationPurpose');
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			Alloy.Globals.simpleAlert(L('locationError'));
		} else {
			var c = e.coords;
			c.latitudeDelta = 0.05;
			c.longitudeDelta = 0.05;
			mapview.region = c;
			Alloy.Globals.Cloud.Checkins.query({
				order : '-created_at',
				limit : 10,
				where : {
					user_id : Alloy.Globals.currentUser.id
				}
			}, function(e) {
				$.usePlaces.title = L('usePlaces');
				if (e.success) {
					var pinViews = [];
					for (var i = 0; i < e.checkins.length; i++) {
						var checkin = e.checkins[i];
						var pinView = Alloy.Globals.Map.createAnnotation({
							latitude : checkin.custom_fields.coordinates[0][0],
							longitude : checkin.custom_fields.coordinates[0][1],
							title : checkin.custom_fields.placeName,
							//subtitle: "",
							pincolor : Alloy.Globals.Map.ANNOTATION_RED,
							placeId : checkin.place_id,
							eventId : checkin.event_id
						});
						pinViews.push(pinView);
					}
					mapview.annotations = pinViews;

					mapview.addEventListener("click", function(e) {
						if (e.clicksource == "pin") {
							enableNextToDate();
							doCheckin = function() {
								$.submitRequest.title = L("checkingIn");
								if ($.description.value == "") {
									alert(L("incomplete_data"));
									$.submitRequest.title = L("checkin");
									return;
								}

								Alloy.Globals.Cloud.Checkins.create({
									event_id : e.annotation.eventId,
									place_id : e.annotation.placeId,
									message : $.description.value,
									custom_fields : {
										foodtruck_name : Alloy.Globals.currentUser.custom_fields.foodtruck_name,
										foodtruck_description : Alloy.Globals.currentUser.custom_fields.description,
										foodtruck_pricing : parseInt(Alloy.Globals.currentUser.custom_fields.pricing_range),
										photo_id : Alloy.Globals.currentUser.photo_id,
										tags : Alloy.Globals.currentUser.tags,
										coordinates : [e.annotation.latitude, e.annotation.longitude],
										placeName : e.annotation.title,
										checkinFinishTime : finishDate,
										checkinStartTime : startDate
									}
								}, function(e) {
									if (e.success) {
										Alloy.Globals.simpleAlert(L("checkinSuccess"), function() {
											$.checkin.close();
										});
									} else {
										alert(JSON.stringify(e));
										Alloy.Globals.simpleAlert(L("checkinFailure"));
										$.submitRequest.title = L("checkin");
									}
								});
							};
						} else {
							disableNext();
						}
					});

				} else {
					alert(L("placesLocationError"));
				}
			});
		}
	});
});

$.useMyLocation.addEventListener("click", function() {
	disableNext();
	$.useMyLocation.title = L('locating');
	Ti.Geolocation.purpose = L('locationPurpose');
	Titanium.Geolocation.getCurrentPosition(function(e) {
		$.useMyLocation.title = L('useMyLocation');
		if (e.error) {
			Alloy.Globals.simpleAlert(L('locationError'));
		} else {
			var c = e.coords;
			c.latitudeDelta = 0.05;
			c.longitudeDelta = 0.05;
			mapview.region = c;

			var mountainView = Alloy.Globals.Map.createAnnotation({
				latitude : c.latitude,
				longitude : c.longitude,
				title : Alloy.Globals.currentUser.custom_fields.foodtruck_name,
				subtitle : L("locationOf") + " " + Alloy.Globals.currentUser.custom_fields.foodtruck_name,
				pincolor : Alloy.Globals.Map.ANNOTATION_RED,
				myid : Alloy.Globals.currentUser.id
			});

			mapview.annotations = [mountainView];
			enableNextToDate();

			doCheckin = function() {
				$.submitRequest.title = L("checkingIn");
				if ($.description.value == "") {
					alert(L("incomplete_data"));
					$.submitRequest.title = L("checkin");
					return;
				}
				Alloy.Globals.Cloud.Places.create({
					name : Alloy.Globals.currentUser.custom_fields.foodtruck_name,
					latitude : c.latitude,
					longitude : c.longitude
				}, function(e) {
					if (e.success) {
						var place = e.places[0];
						Alloy.Globals.Cloud.Checkins.create({
							place_id : place.id,
							message : $.description.value,
							custom_fields : {
								foodtruck_name : Alloy.Globals.currentUser.custom_fields.foodtruck_name,
								foodtruck_description : Alloy.Globals.currentUser.custom_fields.description,
								foodtruck_pricing : parseInt(Alloy.Globals.currentUser.custom_fields.pricing_range),
								photo_id : Alloy.Globals.currentUser.photo_id,
								tags : Alloy.Globals.currentUser.tags,
								coordinates : [place.latitude, place.longitude],
								placeName : place.name,
								checkinFinishTime : finishDate,
								checkinStartTime : startDate
							}
						}, function(e) {
							if (e.success) {
								Alloy.Globals.simpleAlert(L("checkinSuccess"), function() {
									$.checkin.close();
								});
							} else {
								Alloy.Globals.simpleAlert(L("checkinFailure"));
								$.submitRequest.title = L("checkin");
							}
						});
					} else {
						Alloy.Globals.simpleAlert(L("checkinFailure"));
						$.submitRequest.title = L("checkin");
					}
				});
			};
		}
	});
});

var mapview = Alloy.Globals.Map.createView({
	userLocation : true,
	mapType : Alloy.Globals.Map.NORMAL_TYPE,
	animate : true,
	region : {},
	top : 0,
	animate : true,
	zIndex : 1,
	left : 0
});
$.mapContainer.add(mapview);
