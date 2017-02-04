// var footer = require('bottomtabs');
function createOrderList() {
	var dataRows = [];
	for (var i = 0; i < 10; i++) {

		var row = Ti.UI.createTableViewRow({
			height : 70,
			left : 0,
			right : 0,
			backgroundColor : Alloy.Globals.mapsBackgroundColor,
			id : "ViewDetails",
			extend : true,
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
			text : "Pacos Tacos",
			font: {
				fontSize: 18,
				fontFamily: 'Raleway',
				fontWeight:"bold"
			},
			color : Alloy.Globals.buttonColor,
			height : 30,
			width : 140,
		});

		row.add(titleLbl);

		var subTitleLbl = Ti.UI.createLabel({
			left : 80,
			top : 30,
			text : "06/01/16 12:10pm",
			font: {
				fontSize: 11,
				fontFamily: 'Raleway',
				fontWeight:"Medium"
			},
			color : Alloy.Globals.buttonColor3,
			height : 20,
			width : 120,
		});

		row.add(subTitleLbl);

		var deliveryLbl = Ti.UI.createLabel({
			left : 200,
			top : 30,
			text : "$100",
			font: {
				fontSize: 13,
				fontFamily: 'Raleway',
				fontWeight:"Medium"
			},
			color : Alloy.Globals.buttonColor,
			height : 20,
			width : 140,
		});

		row.add(deliveryLbl);
		
		var statusLbl = Ti.UI.createLabel({
			left : 250,
			top : 30,
			text : "Cooking",
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			classes : ["reorderImg"],
			right:10,
			font: {
				fontSize: 13,
				fontFamily: 'Raleway',
				fontWeight:"Medium"
			},
			color : "#A11F62",
			height : 20,
			width : 100,
		});
		if(i == 0){
			row.add(statusLbl);
		}
		var ratingLbl = Ti.UI.createLabel({
			left : 80,
			top : 45,
			text : "Loaded potato, beans, Iced tea",
			font: {
				fontSize: 11,
				fontFamily: 'Raleway',
				fontWeight:"bold"
			},
			color : "#000",
			height : 20,
			width : 220,
		});

		row.add(ratingLbl);

		var reorderView = $.UI.create('ImageView', {
			classes : ["reorderImg"],
			right:10,
			image: "/images/reorder.png"
		});
	
		if(i != 0){
		row.add(reorderView);
		}
		// if(i==0){ reorderView.hide(); }else { reorderView.show(); }
		dataRows.push(row);
	}

	$.orderListTable.setData(dataRows);
	$.orderListTable.addEventListener("click", function(e) 
	{
			if ("ViewDetails" == e.source.id) {
			var currentObj;
			if (e.source.extend) {
				e.source.extend = false;
				e.source.height = 360;
				var currentObj = createExpandView("");
				e.source.currentObj = currentObj;
				e.source.add(currentObj);
			} else {
				e.source.backgroundColor = Alloy.Globals.mapsBackgroundColor;
				e.source.extend = true;
				e.source.height = 70;
				e.source.remove(e.source.currentObj);
			}
		}	
	});

}

createOrderList();

function createExpandView(data) {
	//create Extending view
	var extView = Ti.UI.createView({
		top : 60,
		left : 0,
		right : 0,
		height : 360,
		layout : "vertical",
		backgroundColor : "transparent"
	});
		var goldLbl = $.UI.create('Label', {
			text : "Tod M.",
			top : 8,
			color:Alloy.Globals.navBarColor,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			left:0,
			right:0,
			//left : 40,
			font:{
				fontFamily:"Raleway",
				fontSize:16,
				fontWeight:"bold"
			},
			classes : ["H1BlkLbl"],
		});
		extView.add(goldLbl);
		var lblOrderNumber = $.UI.create('Label', {
			text : "Order #120365",
			color:Alloy.Globals.navBarColor,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			top : 5,
			left:0,
			right:0,
			//left : 40,
			font:{
				fontFamily:"Raleway",
				fontSize:16,
			},
			classes : ["H1BlkLbl"],
		});
		extView.add(lblOrderNumber);
		var imgbarcode = $.UI.create('ImageView', {
			top : 5,
			height : 228,
			width : 226,
			image : '/images/barcode.png'
			// classes : ["loveImg"],
		});
		extView.add(imgbarcode);
	return extView;
}


// $.vendorWin.add(footer.createFooter());
