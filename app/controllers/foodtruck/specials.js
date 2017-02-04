// var footer = require('bottomtabs');
var isList = false;
function createtruckSpecialList() {
	var dataRows = [];
	for (var i = 0; i < 10; i++) 
	{

		var row = Ti.UI.createTableViewRow({
			height : 55,
			left : 0,
			right : 0,
			backgroundColor : Alloy.Globals.mapsBackgroundColor,
		});

		var titleLbl = Ti.UI.createLabel({
			left : 10,
			top : 5,
			text : "Buy 1 entree get 1 free",
			font : {
				fontSize : 14,
				fontFamily : 'Lucida Grande',
				fontWeight : "bold"
			},
			color : "#000",
			height : 25,
			width : Ti.UI.SIZE,
		});

		row.add(titleLbl);

		var subTitleLbl = Ti.UI.createLabel({
			left : 10,
			top : 25,
			text : "M, W, F",
			font : {
				fontSize : 14,
				fontFamily : 'Lucida Grande',
				fontWeight : "bold"
			},
			color : Alloy.Globals.buttonColor,
			height : 20,
			width : 140,
		});

		row.add(subTitleLbl);

		dataRows.push(row);
	}

	$.specialsTable.setData(dataRows);
	$.specialsTable.addEventListener("click", function(e) {
		// Alloy.Globals.baseView.add(Alloy.createController('vendorDetails').getView());
	});

}

createtruckSpecialList();

function UpdateCheckBox(e) {

	Ti.API.info('APIn  ' + JSON.stringify(e));
	if (!e.source.idCheck) {
		e.source.idCheck = true;
		e.source.image = "/images/check_on.png";
	}else{
		e.source.idCheck = false;
		e.source.image = "/images/check_off.png";
	}

}