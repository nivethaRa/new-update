
function createMenuAvailabilityTable() {
	var data = [];

	for (var i = 0; i < 10; i++) {

		var row = Ti.UI.createTableViewRow({
			height : 70,
			left : 0,
			right : 0,
			backgroundColor : Alloy.Globals.mapsBackgroundColor,
		});

		var leftView = Ti.UI.createView({
			height : 70,
			width : "80%",
			left : 0,
			top : 0,
			layout : "vertical"
		});

		row.add(leftView);

		var rightView = Ti.UI.createView({
			height : 70,
			width : "20%",
			right : 0,
			top : 0,
			layout : "vertical",
		});

		row.add(rightView);

		var titlelbl = Ti.UI.createLabel({
			left : 10,
			right : 10,
			top : 5,
			text : "Beef Taco",
			font : {
				fontSize : 16,
				fontFamily : 'Lucida Grande',
				fontWeight : "bold"
			},
			color : "#000",
		});

		leftView.add(titlelbl);

		var desclbl = Ti.UI.createLabel({
			left : 10,
			right : 10,
			top : 5,
			text : "Letluce cheese soure cream loem ipsum loem ipsum loem ipsum Letluce cheese soure cream loem ipsum loem ipsum loem ipsum Letluce cheese soure cream loem ipsum loem ipsum loem ipsum Letluce cheese soure cream loem ipsum loem ipsum loem ipsum Letluce cheese soure cream loem ipsum loem ipsum loem ipsum",
			font : {
				fontSize : 11,
				fontFamily : 'Lucida Grande',
			},
			color : "#000"
		});

		leftView.add(desclbl);

		var priceLbl = Ti.UI.createLabel({
			right : 10,
			top : 10,
			text : "$9.78",
			font : {
				fontSize : 16,
				fontFamily : 'Lucida Grande',
				fontWeight : "bold"
			},
			color : "#000",
		});

		rightView.add(priceLbl);

		var itemImg = Ti.UI.createImageView({
			top : 10,
			right : 10,
			height : 40,
			width : 40,
			backgroundColor : "blue"
		});

		rightView.add(itemImg);

		data.push(row);

	}

	$.tacosTable.setData(data);
}

createMenuAvailabilityTable();
