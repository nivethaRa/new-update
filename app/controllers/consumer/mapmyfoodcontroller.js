// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var AllSites =  args.AllSites;   //Ti.App.Properties.getString("companies", null)
console.log(AllSites);
$.win.barColor = Alloy.Globals.navBarColor;
$.win.navTintColor = "white";

function checkOutNavButtonHandler(){
	
}

if (OS_ANDROID){
  function closeWin(evt){
    $.getView().close();
  }
}

$.getView().addEventListener('close', function(){
  // Let the tabgroup know that a focus event has occurred
  // in case the parent tab needs to be refreshed
  Alloy.Globals.tabConsumer.fireEvent('focus');    
});

var isList = false;

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
$.mapArea.add(mapview);

function createVendorListTable(data) {
	var dataRows = [];
	var pinViews = [];
	var selectLat = 0.0;
	var selectLng = 0.0;
	
	for (var i = 0; i < data.length; i++) {

		var row = Ti.UI.createTableViewRow({
			height : 70,
			left : 0,
			right : 0,
			backgroundColor : Alloy.Globals.mapsBackgroundColor,
			vl_id : data[i].id,
			vl_data : data[i],
		});

		var iconImg = Ti.UI.createImageView({
			left : Alloy.Globals.navigatorIconPadding,
			height : 48,
			width : 48,
			bottom : 10,
			top : 10,
			backgroundColor : "#fff",
			image : "/images/foodtruckBlack.png"
		});

		row.add(iconImg);

		var titleLbl = Ti.UI.createLabel({
			left : 80,
			top : 5,
			text : data[i].company.companyName,
			font:{
				fontFamily:"Raleway",
				fontSize:20
			},
			color : Alloy.Globals.buttonColor,
			height : 20,
			width : 140,
		});

		row.add(titleLbl);

		var subTitleLbl = Ti.UI.createLabel({
			left : 80,
			top : 25,
			text : data[i].company.description,
			font: {
				fontSize: 12,
				fontFamily: 'Raleway',
				fontWeight:"Medium"
			},
			color : "#000",
			height : 20,
			width : 140,
		});

		row.add(subTitleLbl);

		var ratingLbl = Ti.UI.createLabel({
			left : 80,
			top : 45,
			text : "~/5.0",
			font: {
				fontSize: 11,
				fontFamily: 'Raleway',
				fontWeight:"Medium"
			},
			color : Alloy.Globals.buttonColor,
			height : 20,
			width : 140,
		});

		row.add(ratingLbl);

		var openLbl = Ti.UI.createLabel({
			left : 220,
			top : 45,
			text : data[i].company.hours,
			font: {
			fontSize: 13,
				fontFamily: 'Raleway',
				fontWeight:"Medium"
			},
			color : Alloy.Globals.buttonColor,
			height : 20,
			width : 140,
		});

		row.add(openLbl);

		var deliveryLbl = Ti.UI.createLabel({
			right : 10,
			top : 25,
			text : "Delivery",
			font: {
				fontSize: 11,
				fontFamily: 'Raleway',
				fontWeight:"Medium"
			},
			color : Alloy.Globals.buttonColor,
			height : 20,
			width : 60,
		});

		row.add(deliveryLbl);

		var miLbl = Ti.UI.createLabel({
			right : 10,
			top : 45,
			text : "0.3 mi",
			font: {
				fontSize: 11,
				fontFamily: 'Raleway',
				fontWeight:"Medium"
			},
			color : Alloy.Globals.buttonColor,
			height : 20,
			width : 60,
		});

		row.add(miLbl);

		dataRows.push(row);
		
		//CREATE MAP PIN
				var pinView = Alloy.Globals.Map.createAnnotation({
					latitude : data[i].location.latitude,
					longitude : data[i].location.longitude,
					title : data[i].company.companyName,
					//rightView : button,
					pincolor : Alloy.Globals.Map.ANNOTATION_RED,
					uid : data[i].id
				});
				pinViews.push(pinView);
				
				//for now taking the last location of records 
				selectLat = data[i].location.latitude;
				selectLng = data[i].location.longitude;
	}
	
	$.foodListTable.setData(dataRows);
	$.foodListTable.addEventListener("click", function(e) {
		//Alloy.Globals.baseView.add(Alloy.createController('vendorDetails', e.row.vl_data).getView());
		var venderDetail = Alloy.createController('vendorDetails', e.row.vl_data).getView();
		Alloy.Globals.tabConsumer.activeTab.open(venderDetail);
	});
	mapview.annotations = pinViews;
	
	//keep the map open first 
	openMap();
	
	//set map region to default food location
	mapview.region = {latitude:selectLat, longitude:selectLng, latitudeDelta:0.1, longitudeDelta:0.1};
				
}

function openList() {
	if (isList) {
		isList = false;
		//$.mapfoodListView.remove(Alloy.Globals.mapview);
		//$.mapfoodListView.add($.foodListTable);
		//$.mapArea.hide();
		//$.mapfoodListView.show();
		$.foodListTable.show();
		$.mapArea.hide();
		//$.mapfoodListView.remove($.mapArea);
		
		$.mapH.color = "#FFF";
		$.listH.color = Alloy.Globals.buttonColor3;
		$.baseLine.left = null;
		$.baseLine.right = 77;
		$.baseLine.top = 30;
		$.baseLine.height = 2;
		$.baseLine.width = 35;
		$.baseLine.backgroundColor = Alloy.Globals.buttonColor3;
	}
}

function openMap() {
	if (!isList) {
		isList = true;
		
		$.foodListTable.hide();
		//$.mapfoodListView.remove($.foodListTable);
		//$.mapArea.add(Alloy.Globals.mapview);
		$.mapArea.show();
		//$.mapfoodListView.add($.mapArea);
		
		$.mapH.color = Alloy.Globals.buttonColor3;
		$.listH.color = "#FFF";
		$.baseLine.left = 77;
		$.baseLine.right = null;
		$.baseLine.top = 30;
		$.baseLine.height = 2;
		$.baseLine.width = 35;
		$.baseLine.backgroundColor = Alloy.Globals.buttonColor3;
	}
}



createVendorListTable(AllSites);

