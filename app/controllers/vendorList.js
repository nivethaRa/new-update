var args = arguments[0] || {};
var SearchLat = "";
SearchLat = args.lat;
var SearchLng = "";
SearchLng = args.lng;
console.log(JSON.stringify(args));
//alert(SearchLat+"  :  "+SearchLng);

var moment = require('alloy/moment');
var SFEZKeys = require("SFEZKeys");



var mapview = Alloy.Globals.Map.createView({
	userLocation : true,
	mapType : Alloy.Globals.Map.NORMAL_TYPE,
	animate : true,
	regionFit : true,
	region : {},
	top : 0,
	animate : true,
	zIndex : 1,
	left : 0
});
$.mapArea.add(mapview);

var AllVendors = [];
var isList = false;
function createVendorListTable(data) {
	var dataRows = [];
	for (var i = 0; i < data.length; i++) {
		Ti.API.info("********************createVendorListTable***************** " + JSON.stringify(data[i]));
		var row = Ti.UI.createTableViewRow({
			height : 75,
			left : 0,
			right : 0,
			backgroundColor : Alloy.Globals.mapsBackgroundColor,
			vendor : data[i],
			unit : data[i].unit,
			uid: data[i].company_id
		});

		var iconType = Ti.UI.createImageView({
		 height : 19,
		 width : 20,
		 right : 35,
		 top : 10,
		 image : "/images/tabicons/brick.png"
		 });
		 //row.add(iconType);
		 
		var leftButtonIcon = "";
		
		if(data[i].company.photo){
			if((data[i].company.photo).toString().indexOf("https://") == -1){
				leftButtonIcon = "https://" + data[i].company.photo ;
			}
			else{
				leftButtonIcon =data[i].company.photo ;
			}
	//		leftButtonIcon = ((data[i].company.photo).toString()).indexOf("https://") != -1 ? (data[i].company.photo) ; ("https://"+ data[i].company.photo);
		}
		else{
			if(data[i].unit.type == "TRUCK"){
				leftButtonIcon = "/images/consumerordering/food_truck_small.png";
			}else if (data[i].unit.type == "CART"){
				leftButtonIcon = "/images/consumerordering/foodcart_small.png";
			}else{
				leftButtonIcon = "/images/consumerordering/brick_small.png";
			}
		}  
		
		//Ti.API.info("left icon imagesss::: "+data[i].company.photo);
		
		var iconTrend = Ti.UI.createImageView({
			height : 13,
			width : 17,
			right : 20,
			top : 10,
			image : "/images/tabicons/trending.png"
		});
		//row.add(iconTrend);

		var iconImg = Ti.UI.createImageView({
			left : Alloy.Globals.navigatorIconPadding,
			height : 48,
			width : 48,
			image : leftButtonIcon
		});
		row.add(iconImg);

		var titleLbl = Ti.UI.createLabel({
			left : 80,
			top : 5,
			text : data[i].unit.company_name,
			font : {
				fontFamily : "Raleway",
				fontSize : 20
			},
			color : Alloy.Globals.buttonColor,
			width : 200,
			maxLines : 1,
			height : Ti.UI.SIZE
		});

		row.add(titleLbl);
		
		var distLbl = Ti.UI.createLabel({
			right : 10,
			text : Alloy.Globals.GetDistanceFromLocation(data[i].unit.latitude, data[i].unit.longitude,true),
			font : {
				fontFamily : "Raleway",
				fontSize : "10"
			},
			color : Alloy.Globals.buttonColor,
			width : 100,
			textAlign:"right",
			maxLines : 1,
			height : Ti.UI.SIZE,
			//backgroundColor:"pink"
		});

		row.add(distLbl);
		
		var subTitleLbl = Ti.UI.createLabel({
			left : 80,
			top : 30,
			text : (data[i].unit.tags != "") ? data[i].unit.tags : "", 
			font : {
				fontSize : 12,
				fontFamily : 'Raleway',
				fontWeight : "Medium"
			},
			color : "#000",
			maxLines : 1,
			height : Ti.UI.SIZE,
			width : 140,
		});
		//alert(data[i].unit.tags);
		if(data[i].unit.tags != ""){
			row.add(subTitleLbl);	
		}
		var ratingLbl = Ti.UI.createLabel({
			left : 80,
			top : 45,
			text : "Rating: -/5.0",
			font : {
				fontSize : 11,
				fontFamily : 'Raleway',
				fontWeight : "Medium"
			},
			color : Alloy.Globals.buttonColor,
			height : 20,
			width : 140,
		});

		row.add(ratingLbl);

		/*var ditanceLbl = Ti.UI.createLabel({
			right : 20,
			top : 45,
			text : Alloy.Globals.GetDistanceFromLocation(data[i].unit.latitude, data[i].unit.longitude),
			font : {
				fontSize : 11,
				fontFamily : 'Raleway',
				fontWeight : "Medium"
			},
			color : Alloy.Globals.buttonColor,
			width : Ti.UI.SIZE,
			maxLines : 2
		});

		row.add(ditanceLbl);*/

		dataRows.push(row);
	}

	$.vendorListTable.setData(dataRows);
	$.vendorListTable.addEventListener("click", function(e) {
		
		
		Ti.API.info("********************openVendorDetailPage ID***************** " + JSON.stringify(e.row.vendor));
		
		openVendorDetailPage(e.row.vendor.company.id,e.row.unit);
		return;
		Ti.API.info(JSON.stringify(e.row.unit));
		var venderDetail = Alloy.createController('vendorDetails', {
			vendor : e.row.vendor,
			unit : e.row.unit,
			customerID : args.customerID
		}).getView();
		venderDetail.open();
		//Alloy.Globals.tabConsumer.activeTab.open(venderDetail);
	});

}

function openList() {
	if (isList) {
		isList = false;
		$.vendorListTable.show();
		$.mapArea.hide();
		$.mapH.color = "gray";
		$.listH.color = Alloy.Globals.navBarColor;
		//$.baseLine.left = null;
		//$.baseLine.right = 77;
		//$.baseLine.top = 30;
		//$.baseLine.height = 2;
		//$.baseLine.width = 35;
		$.baseLineList.backgroundColor = Alloy.Globals.navBarColor;
		$.baseLineList.show();
		$.baseLineMap.hide();
	}
}

function openMap() {
	if (!isList) {
		isList = true;
		$.vendorListTable.hide();
		$.mapArea.show();
		$.mapH.color = Alloy.Globals.navBarColor;
		$.listH.color = "gray";
		$.baseLineMap.backgroundColor = Alloy.Globals.navBarColor;
		$.baseLineMap.show();
		$.baseLineList.hide();
		//$.baseLineMap.left = 77;
		//$.baseLine.right = null;
		//$.baseLine.top = 30;
		//$.baseLine.height = 2;
		//$.baseLine.width = 35;
		//$.baseLine.backgroundColor = Alloy.Globals.buttonColor3;
	}
}

function getVendorListData() {
	Alloy.Globals.Services.Vendor.GetList(function(response) {
		//console.log(response);
		if (response.length > 0) {
			Ti.App.Properties.setString("companies", response);
			Alloy.Globals.vendors = response;
			Ti.API.info("********************getVendorListData***************** " + JSON.stringify(response));
			//createVendorListTable(response);
			getCurrentLocation();
		} else {
			alert("Record Not Found");
		}
	});
}

var infoContainer = $.UI.create('View', {
	classes : ["infoContainer"],
});

var infoContainerHeight = infoContainer.getHeight();

function hideLoading() {
	infoContainer.removeAllChildren();
	infoContainer.visible = false;
}

function showTimingInfo(textToDisplay, timeToDisplayInSeconds) {
	infoContainer.visible = true;
	var label = Titanium.UI.createLabel({
		text : textToDisplay,
		left : Alloy.Globals.navigatorIconPadding,
		right : Alloy.Globals.navigatorIconPadding,
		height : infoContainerHeight,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : Alloy.Globals.darkTextColor,
		wordWrap : true,
		font : {
			fontWeight : 'bold'
		}
	});
	label.animate({
		opacity : 0.3,
		repeat : timeToDisplayInSeconds,
		duration : 1000,
		autoreverse : true,
		curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
	}, function() {
		infoContainer.visible = false;
		infoContainer.remove(label);
	});
	infoContainer.add(label);
}

function showLoading() {
	Ti.API.info("****************showLoading************** " + infoContainerHeight);
	infoContainer.visible = true;
	var radarColor = "black";
	var view1 = Titanium.UI.createView({
		height : 0,
		width : 0,
		borderRadius : infoContainerHeight,
		borderWidth : 3,
		opacity : 0.3,
		backgroundColor : radarColor,
		borderColor : radarColor
	});

	var view2 = Titanium.UI.createView({
		height : infoContainerHeight,
		width : infoContainerHeight
	});
	view2.add(view1);

	infoContainer.add(view2);
	view1.animate({
		height : infoContainerHeight,
		width : infoContainerHeight,
		repeat : 9999,
		duration : 2000,
		autoreverse : true,
		curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	mapview.add(infoContainer);
}

function openVendorDetailPage(uid, unit) {
	Ti.API.info("**************openVendorDetailPage*************** " + uid,JSON.stringify(unit));
	for (var i = 0; i < Alloy.Globals.vendors.length; i++) {
		if (Alloy.Globals.vendors[i].id == uid) {
			var venderDetail = Alloy.createController('vendorDetails', {
				vendor : Alloy.Globals.vendors[i],
				unit : unit,
				customerID : args.customerID
			}).getView();
			venderDetail.open();
			break;
		}
	}
}

function getSitesListData(requestData) {
	var pinViews = [];
	var activeVendors = [];
	var selectLat = 0.0;
	var selectLng = 0.0;
	Alloy.Globals.Services.Vendor.getSitesListData(requestData, function(resp) {
		Ti.API.info("getSitesListData--->"+ JSON.stringify(resp));
		hideLoading();
		if (resp.length > 0) {
			Ti.API.info('CHECK IN ' + JSON.stringify(resp));
			var pinViews = [];
			for (var i = 0; i < resp.length; i++) {
				var checkin = resp[i];
				var rightView = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.SIZE,
					uid : checkin.company_id,
					color : 'blue'
				});
				var leftView = Ti.UI.createLabel({
					width : Ti.UI.SIZE,
					height : Ti.UI.SIZE,
					text : "Truck"
				});
				if (OS_IOS) {
					utils.hyperLinkOfText(rightView);
				} else {
					rightView.html = "<u>" + L("details") + "</u>";
					rightView.autoLink = Titanium.UI.AUTOLINK_ALL;
				}

				//Details action on iphone must be in the button not in the pin
				if (Ti.Platform.osname == 'iphone') {
					rightView.addEventListener('click', function(e) {
						openVendorDetailPage(e.source.uid);
					});
				}

				//CREATE MAP PIN
				var leftButtonIcon = "";
				if(resp[i].type == "TRUCK"){
					leftButtonIcon = "/images/consumerordering/food_truck_small.png";
				}else if (resp[i].type == "CART"){
					leftButtonIcon = "/images/consumerordering/foodcart_small.png";
				}else{
					leftButtonIcon = "/images/consumerordering/brick_small.png";
				}
				var pinView = Alloy.Globals.Map.createAnnotation({
					latitude : resp[i].latitude,
					longitude : resp[i].longitude,
					title : resp[i].company_name,
					subtitle : resp[i].tags,
					leftButton : leftButtonIcon,
					rightView : rightView,
					image: leftButtonIcon,
					pincolor : Alloy.Globals.Map.ANNOTATION_RED,
					uid : resp[i].company_id,
					unit : resp[i]
				});
				pinViews.push(pinView);
				mapview.annotations = pinViews;
				if (pinViews.length == 0) {
					showTimingInfo(L("noFoodTruckFound"), 3);
				} else {
					showTimingInfo(L("selectTheFoodTruck"), 3);
				}
				for (var j = 0; j < Alloy.Globals.vendors.length; j++) {
					Ti.API.info("**************Alloy.Globals.vendors****1*************** " + Alloy.Globals.vendors[j].id + " " + resp[i].company_id);
					
					
					Ti.API.info("**************Test Manpreet*************** " + Alloy.Globals.vendors[j].id + " " + resp[i].company_id);
					if (Alloy.Globals.vendors[j].id == resp[i].company_id) {
						activeVendors.push({
							unit : resp[i],
							company : Alloy.Globals.vendors[j]
						});
						break;
					}
				}
			}
			Ti.API.info("**************Alloy.Globals.vendors*****2************** " + activeVendors.length);
			createVendorListTable(activeVendors);
		} else {
			//Ti.API.info('CHECKIN FAILED ' + JSON.stringify(e));
			alert(L("placesLocationError"));
		}
	});
}

function openLocationSettings(_message) {
	var dialog = Ti.UI.createAlertDialog({
		title : L('location_error'),
		message : _message,
		buttonNames : ['Settings', 'Cancel']
	});
	dialog.show();
	dialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			var settingsIntent = Titanium.Android.createIntent({
				action : 'android.settings.LOCATION_SOURCE_SETTINGS'
			});
			Ti.Android.currentActivity.startActivity(settingsIntent);
		}
	});
}

function openDeveloperOption() {
	var dialog = Ti.UI.createAlertDialog({
		message : "Please disable mock locations first",
		buttonNames : ['Settings', 'Cancel']
	});
	dialog.show();
	dialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			var settingsIntent = Titanium.Android.createIntent({
				action : 'android.settings.APPLICATION_DEVELOPMENT_SETTINGS'
			});
			Ti.Android.currentActivity.startActivity(settingsIntent);
		}
	});
}

function savelocation(params) {
	if (!params) {
		hideLoading();
		return;
	}
	if (!params.latitude) {
		hideLoading();
		//don't accept mock locations move to developer settings to disable
		openLocationSettings(params);
		return;
	}
	Ti.API.info("*********location is*************** " + params.latitude + " " + params.longitude + " " + moment().toISOString());

	Alloy.Globals.currentLat = params.latitude;
	Alloy.Globals.currentLng = params.longitude;

	mapview.region = {
		latitude : (SearchLat != undefined) ? SearchLat : params.latitude,
		longitude : (SearchLng != undefined) ? SearchLng : params.longitude,
		latitudeDelta : 0.02,
		longitudeDelta : 0.02
	};

	/*var circle = Alloy.Globals.Map.createCircle({
	 center : {
	 latitude : params.latitude,
	 longitude : params.longitude
	 },
	 radius : 2000, //1km
	 fillColor : "#20FF0000"
	 });
	 mapview.addCircle(circle);*/
	var searchPref =  Alloy.Globals.getData(SFEZKeys.KEYS.CUSTOMER_SEARCH_PREF);
	Ti.API.info("*********searchPref is*************** " + JSON.stringify(searchPref));
	var arr = {
		latitude : (SearchLat != undefined) ? SearchLat : params.latitude,
		longitude : (SearchLng != undefined) ? SearchLng : params.longitude,
		date : moment().toISOString(),
		distance : (searchPref != null) ? searchPref.distance : "2"
	};
	getSitesListData(arr);
}

mapview.addEventListener("click", function(e) {
	Ti.API.info("*******mapview************ " + e.clicksource);
	if (Ti.Platform.osname == 'android') {
		if (e.clicksource == "rightPane") {
			openVendorDetailPage(e.annotation.uid, e.annotation.unit);
		}
	}
});

//Get user location
//Alloy.Globals.GetCurrentUesrLocation();
getVendorListData();
showLoading();

var currentLocation  = require("currentLocation");

function getCurrentLocation(){
	currentLocation.getCurrentLocation({
	 	callBack : savelocation
	});
} 
openMap();

/*function(response) {
 //console.log(response);
 if (response.length > 0) {
 for (var i = 0; i < AllVendors.length; i++) {
 var vendor = AllVendors[i];
 var sites = [];
 for (var j = 0; j < response.length; j++) {
 var site = response[j];
 if (vendor.id == site.company) {
 vendor.lat = site.location.latitude;
 vendor.lng = site.location.longitude;
 sites.push(site);

 var pinView = Alloy.Globals.Map.createAnnotation({
 latitude : site.location.latitude,
 longitude : site.location.longitude,
 title : site.name,
 //rightView : button,
 pincolor : Alloy.Globals.Map.ANNOTATION_RED,
 uid : site.company
 });
 pinViews.push(pinView);

 //for now taking the last location of records
 selectLat = site.location.latitude;
 selectLng = site.location.longitude;

 }
 }
 vendor.sites = sites;
 }
 mapview.annotations = pinViews;
 //set map region to default food location
 mapview.region = {
 latitude : selectLat,
 longitude : selectLng,
 latitudeDelta : 0.1,
 longitudeDelta : 0.1
 };
 } else {
 alert("Record Not Found");
 }
 }*/
