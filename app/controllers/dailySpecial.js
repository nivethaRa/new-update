var serviceUtility = require('ServiceUtility');

var isList = false;
function createDailySpecialsTable(data) {
	var dataRows = [];
	for (var i = 0; i < data.length; i++) {

		var row = Ti.UI.createTableViewRow({
			height : 70,
			left : 0,
			right : 0,
			backgroundColor : Alloy.Globals.mapsBackgroundColor,
			special_id : data[i].id
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
			text : data[i].name,
			font : {
				fontSize : 20,
				fontFamily : 'Raleway',
				fontWeight : "bold"
			},
			color : "black",
			height : 30,
			right : 90,
		});

		row.add(titleLbl);

		var subTitleLbl = Ti.UI.createLabel({
			left : 80,
			top : 29,
			text : "Kids Free",
			font : {
				fontSize : 12,
				fontFamily : 'Lucida Grande',
			},
			color : "gray",
			height : 20,
			width : 140,
		});

		row.add(subTitleLbl);

		var ratingLbl = Ti.UI.createLabel({
			left : 80,
			top : 45,
			text : data[i].price,
			font : {
				fontSize : 11,
				fontFamily : 'Raleway',
			},
			color : Alloy.Globals.buttonColor,
			height : 20,
			width : 140,
		});

		row.add(ratingLbl);

		var redeemImg = $.UI.create('Button', {
			right : 10,
			width : 80,
			height : 35,
			title : "Order",
			// image : "/images/redeem.png",
			color : "#FFF",
			font : {
				fontSize : 16,
				fontFamily : 'Raleway',
				fontWeight : "bold"
			},
			backgroundColor : Alloy.Globals.buttonColor2,
			borderColor : Alloy.Globals.buttonColor2,
			top : 20,
			borderRadius : 1
		});

		row.add(redeemImg);

		dataRows.push(row);
	}
	$.specialTable.setData(dataRows);
	$.specialTable.addEventListener("click", function(e) {
	// Alloy.Globals.baseView.add(Alloy.createController('vendorDetails').getView());
	});
}

function getDailySpecialsData() {
	Ti.API.info("************getDailySpecialsData***************");
	Alloy.Globals.Services.Consumer.GetDailySpecials(function(response) {
		console.log(response);
		if (response.length > 0) {
			Ti.API.info("************getDailySpecialsData********if*******");
			var specials = [];
			for (var i = 0; i < response.length; i++) {
				var special = response[i];
				for (var j = 0; j < Alloy.Globals.vendors.length; j++) {
					var vendor = Alloy.Globals.vendors[j];
					if (special.company == vendor.id) {
						special.vname = vendor.name;
						specials.push(special);
						break;
					}
				}
			}
			Ti.API.info("************getDailySpecialsData********if******* " + specials.length);
			createDailySpecialsTable(specials);
			//createDailySpecialsTable(response);
		} else {
			Ti.API.info("************getDailySpecialsData********else*******");
			alert("Record Not Found");
		}
	});
}
//getDailySpecialsData();
