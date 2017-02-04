var isClicked = false;
function createLoyaltyList() {
	var dataRows = [];
	for (var i = 0; i < 10; i++) {

		var row = Ti.UI.createTableViewRow({
			height : 60,
			left : 0,
			right : 0,
			selectedColor : "#FFF",
			backgroundColor : Alloy.Globals.mapsBackgroundColor,
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
			font:{
				fontFamily:"Raleway",
				fontSize:19
			},
			color : Alloy.Globals.buttonColor,
			height : 25,
			width : 140,
		});

		row.add(titleLbl);
		var extView = Ti.UI.createView({
			top : 30,
			left : 80,
			height : 20,
			layout : "horizontal",
			backgroundColor : "transparent"
		});
		
		var subTitleLbl = Ti.UI.createLabel({
			left : 5,
			top : 25,
			text : L('MyLoyaltyMoreNeeded'),
			font : {
				fontFamily:"Raleway",
				fontSize:14
			},
			color : "#000",
			height : 20,
		});

		//row.add(subTitleLbl);

		var ratingLbl = Ti.UI.createLabel({
			text : "1 pts",
			font:{
				fontFamily:"Raleway",
				fontSize:14
			},
			color : Alloy.Globals.buttonColor,
			height : 20,
		});
		if(i == 0 || i == 3 || i == 6){
			ratingLbl.text = "1 pts";
		}
		if(i == 1 || i == 4 || i == 7){
			ratingLbl.text = "2 pts";
		}
		if(i == 2 || i == 5 || i == 8){
			ratingLbl.text = "3 pts";
		}
		
		extView.add(ratingLbl);
		//extView.add(subSepTitleLbl);
		extView.add(subTitleLbl);
		row.add(extView);
		
		var rightImg = $.UI.create('ImageView', {
			right : 15,
			top : 5,
			id : "addEdit",
			classes : ["addEditImg"],
		});

		row.add(rightImg);

		dataRows.push(row);
	}

	$.loyaltyTable.setData(dataRows);

	$.loyaltyTable.addEventListener("click", function(e) {

		Ti.API.info('data ' + e.source + "    " + JSON.stringify(e.source));
		if ("addEdit" == e.source.id) 
		{
			//Alloy.createController('editReview').getView().open();
			var reviewControl = Alloy.createController('editReview').getView();
			Alloy.Globals.tabConsumer.activeTab.open(reviewControl);
		}
	});
}

// create Rewars Table

function createRewardsList() {
 var dataRows = [];
	Alloy.Globals.Services.Vendor.GET_ALL_LOYALTY_REWARDS(function(data) {
		 Ti.API.info('GET_ALL_LOYALTY_REWARDS' + data);
		 for (var i = 0; i < data.length; i++) {
			 Alloy.Globals.Services.Vendor.GETCOMPANYDETAILS(data[i].company_id, function(resp) {
 					var row = Ti.UI.createTableViewRow({
					height : 60,
					left : 0,
					right : 0,
					companyID : resp.id,
					backgroundColor : Alloy.Globals.mapsBackgroundColor,
				});

				var iconImg = Ti.UI.createImageView({
					left : Alloy.Globals.navigatorIconPadding,
					height : 48,
					width : 48,
					bottom : 10,
					top : 10,
					backgroundColor : "#fff",
					image :resp.photo
				});
		
				row.add(iconImg);
		
				var titleLbl = Ti.UI.createLabel({
					left : 80,
					top : 5,
					text : resp.name,
					font:{
						fontFamily:"Raleway",
						fontSize:19
					},
					color : Alloy.Globals.buttonColor,
					height : 25,
					right : 60,
				});
		
				row.add(titleLbl);
		
				var ratingLbl = Ti.UI.createLabel({
					left : 80,
					top : 30,
					id : "ViewDetails",
					extend : true,
					parantObj : row,
					text : L('RewardsViewDetails'),
					font : {
						fontSize : 12,
						fontFamily : 'Lucida Grande',
						fontWeight : "bold"
					},
					color : Alloy.Globals.buttonColor3,
					height : 20,
					width : 90,
				});
		
				row.add(ratingLbl);
		
				var ptBlncLbl = $.UI.create('Label', {
					text : "Point\nBalance",
					visible : false,
					top : 10,
					right : 10,
					font : {
						fontSize : 10,
						fontFamily : 'Lucida Grande'
					},
					color : "#000"
				});
		
				row.add(ptBlncLbl);
				var ptsNo = $.UI.create('Label', {
					text : "0",
					visible : false,
					top : 35,
					right : 18,
					font : {
						fontSize : 15,
						fontFamily : 'Lucida Grande',
						fontWeight : "bold"
					},
					color : Alloy.Globals.buttonColor,
				});
				row.hide1 = ptBlncLbl;
				row.hide2 = ptsNo;
				row.add(ptsNo);
		
				dataRows.push(row);
				$.rewardsTable.setData(dataRows);
				
			 });
		 }	
		 $.rewardsTable.addEventListener("click", function(e) {

					if ("ViewDetails" == e.source.id) {
						var currentObj;
						if (e.source.extend) {
							e.source.parantObj.hide1.visible = true;
							e.source.parantObj.hide2.visible = true;
							e.source.parantObj.backgroundColor = "#FFF";
							e.source.extend = false;
							e.source.parantObj.height = 300;
							e.source.text = "View Details -";
							var currentObj = createExpandView(e.row.companyID);
							e.source.currentObj = currentObj;
							e.source.parantObj.add(currentObj);
						} else {
							e.source.parantObj.hide1.visible = false;
							e.source.parantObj.hide2.visible = false;
							e.source.parantObj.backgroundColor = Alloy.Globals.mapsBackgroundColor;
							e.source.extend = true;
							e.source.parantObj.height = 60;
							e.source.text = "View Details +";
							e.source.parantObj.remove(e.source.currentObj);
						}
					}
			});
	});
}

function createExpandView(data) {
	//create Extending view
	var extView = Ti.UI.createView({
		top : 60,
		left : 0,
		right : 0,
		height : 240,
		layout : "horizontal",
		backgroundColor : "#FFF"
	});

	Alloy.Globals.Services.Vendor.getLoyaltyRewards(data,function(response) {
		Ti.API.info(data+"**************data************** " + response);
			Alloy.Globals.rewardsList = response;
		    for (var j = 0; j < response.length;j++) {
			var redeem_gold = response[j].gold_reward_item;
			var redeem_silver = response[j].silver_reward_item;
			var redeem_bronze = response[j].bronze_reward_item;
		
			for (var i = 0; i < 3; i++) {
				var h1 = Ti.UI.createView({
					top : 0,
					left : 0,
					height : 240,
					width : "33%",
					layout : "vertical",
				});
		
				var goldImg = $.UI.create('ImageView', {
					top : 10,
					height : 40,
					width : 55,
					// classes : ["loveImg"],
				});
		
				if (i == 0) {
					goldImg.image = "/images/prize_gold.png";
				} else if (i == 1) {
					goldImg.image = "/images/prize_silver.png";
				} else if (i == 2) {
					goldImg.image = "/images/prize_bronze.png";
				}
		
				h1.add(goldImg);
		
				var goldLbl = $.UI.create('Label', {
					text : "Gold",
					top : 5,
					left : 0,
					right:0,
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					font:{
						fontFamily:"Raleway",
						fontSize:16,
						fontWeight:"bold"
					},
					classes : ["H1BlkLbl"],
				});
		
				h1.add(goldLbl);
		
				var backView = $.UI.create('View', {
					top : 5,
					//left : 43,
					height : 40,
					width : 40,
					layout : "vertical",
					backgroundImage : "/images/circle.png"
				});
		
				h1.add(backView);
		
				var ptsLbl = $.UI.create('Label', {
					text : "15",
					top : 5,
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					//width:"40px",
					font:{
						fontFamily:"Raleway",
						fontSize:14
					},
					classes : ["H2BoldLblDef"],
				});
				
				if (i == 0) {
					ptsLbl.text = "15";
				} else if (i == 1) {
					ptsLbl.text = "10";
				} else if (i == 2) {
					ptsLbl.text = "5";
				}
				
				backView.add(ptsLbl);
		
				var pts = $.UI.create('Label', {
					text : "pts",
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					top : 0,
					width:20,
					font:{
						fontFamily:"Raleway",
						fontSize:10
					},
					classes : ["H2BlkLbl"],
					opacity : 0.6
				});
		
				backView.add(pts);
				
				
				if (i == 0) {
					var itemLbl = $.UI.create('Label', {
						text : redeem_gold,
						top : 10,
						left : 10,
						right : 10,
						textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
						font:{
							fontFamily:"Raleway",
							fontSize:14
						},
						classes : ["H2BlkLbl"],
					});
		
				} else if (i == 1) {
						var itemLbl = $.UI.create('Label', {
						text : redeem_silver,
						top : 10,
						left : 10,
						right : 10,
						textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
						font:{
							fontFamily:"Raleway",
							fontSize:14
						},
						classes : ["H2BlkLbl"],
					});
				} else if (i == 2) {
						var itemLbl = $.UI.create('Label', {
						text : redeem_bronze,
						top : 10,
						left : 10,
						right : 10,
						textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
						font:{
							fontFamily:"Raleway",
							fontSize:14
						},
						classes : ["H2BlkLbl"],
					});
				}
				
				h1.add(itemLbl);
				
				var redeemImg = $.UI.create('ImageView', {
					top : 0,
					width : 70,
					height : 43,
				});
		
				if (i == 0) {
					goldLbl.text = "Gold";
					h1.add(redeemImg);
					redeemImg.image = "/images/redeem.png";
				} else if (i == 1) {
					goldLbl.text = "Silver";
					h1.add(redeemImg);
					redeemImg.image = "/images/redeem.png";
				} else if (i == 2) {
					goldLbl.text = "Bronze";
					h1.add(redeemImg);
					redeemImg.image = "/images/redeem.png";
				}
		
				//var itemLbl = $.UI.create('Label', {
				//	text : "1 sandwitch 1 side & 1 drink",
				//	top : 10,
				//	left : 10,
				//	classes : ["H2BlkLbl"],
				//});
		
				//h1.add(itemLbl);
				extView.add(h1);
			}
		}		 
	});
	return extView;
}

function openLoyalty() {
	if (!isClicked) {
		isClicked = true;
		
		$.rewardsTable.hide();
		$.loyaltyTable.show();
		
		// createLoyaltyList();
		// $.loyaltyRewardsView.remove($.rewardsTable);
		// $.loyaltyRewardsView.add($.loyaltyTable);
		
		$.rewatdsH.color = "gray";
		$.loyaltyH.color = Alloy.Globals.navBarColor;
		$.baseLineLoyal.backgroundColor = Alloy.Globals.navBarColor;
		$.baseLineLoyal.show();
		$.baseLineReward.hide();
	}
}

function openRewards() {
	if (isClicked) {
		isClicked = false;
		
		$.rewardsTable.show();
		$.loyaltyTable.hide();

		// createRewardsList();
		// $.loyaltyRewardsView.remove($.loyaltyTable);
		// $.loyaltyRewardsView.add($.rewardsTable);
		
		$.loyaltyH.color = "gray";
		$.rewatdsH.color = Alloy.Globals.navBarColor;
		$.baseLineReward.backgroundColor = Alloy.Globals.navBarColor;
		$.baseLineReward.show();
		$.baseLineLoyal.hide();
	}
}

//$.loyaltyRewardsView.remove($.rewardsTable);

//
createLoyaltyList();
createRewardsList();
openLoyalty();

