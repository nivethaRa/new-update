var serviceUtility = require('ServiceUtility');
function createReviews(data) {
	var dataRows = [];
	for (var i = 0; i < data.length; i++) {

		var row = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			left : 0,
			right : 0,
			backgroundColor : Alloy.Globals.mapsBackgroundColor,
			SF_ID : data[i].id,
			SF_DATA : data[i],
		});

		var leftView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : "80%",
			left : 0,
			layout : "vertical",
			top : 0,
		});
		row.add(leftView);

		var rightView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : "20%",
			right : 0,
			layout : "vertical",
			top : 0,
		});
		row.add(rightView);
		// row.add(iconImg);

		var titleLbl = Ti.UI.createLabel({
			left : 15,
			top : 5,
			text : "12/12/2016",
			font : {
				fontSize : 14,
				fontFamily : 'Lucida Grande',
				fontWeight : "bold"
			},
			color : Alloy.Globals.buttonColor3,
			height : 20,
			width : 140,
		});

		leftView.add(titleLbl);

		var subTitleLbl = Ti.UI.createLabel({
			left : 15,
			top : 5,
			text : "hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello", //data[i].description,
			font : {
				fontSize : 12,
				fontFamily : 'Lucida Grande',
			},
			color : "#000",
			height : Ti.UI.SIZE,
		});

		leftView.add(subTitleLbl);

		var byLbl = Ti.UI.createLabel({
			right : 15,
			top : 10,
			textAlign : "right",
			text : "- Jeff S.", //data[i].name,
			font : {
				fontSize : 15,
				fontFamily : 'Lucida Grande',
				fontWeight : "bold"
			},
			color : "#000",
			height : Ti.UI.SIZE,

		});

		leftView.add(byLbl);

		var powrView = Ti.UI.createView({
			top : 0,
			left : 0,
			width : Ti.UI.FILL,
			height : 45,
			backgroundImage : "/images/power_review.png",
		});
		
		if (data[i].powerReviewer == "true") {
			rightView.add(powrView);
		}
		
		rightView.add(powrView);
		
		var outOfLbl = Ti.UI.createLabel({
			right : 10,
			bottom : 10,
			text : "4.9/5.0",
			font : {
				fontSize : 13,
				fontFamily : 'Lucida Grande',
			},
			color : "#000",
			height : 20,
		});

		powrView.add(outOfLbl);

		var iconImg = Ti.UI.createImageView({
			height : 35,
			width : 35,
			top : 9,
			image : "/images/foodtruckBlack.png"
		});

		rightView.add(iconImg);

		dataRows.push(row);
	}

	$.reviewsViewTable.setData(dataRows);

}

function openList() {

}

function openMap() {
}

function getReviewData() {
	var url = Alloy.CFG.services.DOMAIN + Alloy.CFG.services.users_review;
	serviceUtility.get(url, function(e) {
		Ti.API.info('REVIEW:: ' + JSON.stringify(e));
		if (e.length > 0) {
			createReviews(e);
		} else {
			alert("Record Not Found");
		}

	});

}

getReviewData();
