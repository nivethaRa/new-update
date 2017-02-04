var vendorData = arguments[0];

Ti.API.info("********************vendor detail***************** " + JSON.stringify(vendorData));

var vendor = vendorData.vendor;
var unit = vendorData.unit;
var customer_id = vendorData.customerID ;
if(vendorData.vendor.delivery_chg_amount != null){
	var delivery_charge_amount = ((Number(vendorData.vendor.delivery_chg_amount) * 10) / 10).toFixed(2);
}else{
	var delivery_charge_amount = 0.00;
}
var delivery_charge_item_id= vendorData.vendor.delivery_chg_item_id;

var fav_no = 0;

$.win.barColor = Alloy.Globals.navBarColor;
$.win.navTintColor = "white";
(OS_IOS) ? ($.win.title = "Vendor Details") : ($.winTitle.text = "Vendor Details");
Alloy.Globals.selectedMenuItems = [];

if (OS_ANDROID) {
	function closeWindow(evt) {
		$.getView().close();
	}

}

if (OS_IOS) {
	utils.hyperLinkOfText($.reviewsLbl);
	utils.hyperLinkOfText($.mapItLbl);
} else {
	$.reviewsLbl.html = "<u>" + "Reviews" + "</u>";
	$.reviewsLbl.autoLink = Titanium.UI.AUTOLINK_ALL;
	$.mapItLbl.html = "<u>" + "Map It" + "</u>";
	$.mapItLbl.autoLink = Titanium.UI.AUTOLINK_ALL;
}

function goToMyOrder() {

}

function checkOutNavButtonHandler() {

}


$.getView().addEventListener('close', function() {
	// Let the tabgroup know that a focus event has occurred
	// in case the parent tab needs to be refreshed
	//Alloy.Globals.tabConsumer.fireEvent('focus');
});


// Edited by Aryvart - Open
		Ti.API.info("vendor.photo^^^^" +vendor.photo);
         $.vendorPhoto.image =  vendor.photo;
         
         
            /* if(unit.type == "TRUCK"){
            	$.vendorPhoto.image =  vendor.photo;
				if(vendor.photo == ""){
					$.vendorPhoto.image = "https://" + vendor.photo;
				}else{
					$.vendorPhoto.image = "/images/consumerordering/food_truck_small.png";
				}				
			}else if (unit.type == "CART"){
				$.vendorPhoto.image =  vendor.photo;
				/*
				if(vendor.photo == ""){	
					$.vendorPhoto.image = "https://" + vendor.photo;
				}else{
					$.vendorPhoto.image = "/images/consumerordering/foodcart_small.png";
				} 
			}else{
				$.vendorPhoto.image = vendor.photo;
				if(vendor.photo == "")
					$.vendorPhoto.image = vendor.photo;
				  }else{
					$.vendorPhoto.image = "/images/consumerordering/brick_small.png";
				} 	
			}*/
// Edited by Aryvart - close		
			
$.titelLbl.text = vendor.name;
$.subTitelLbl.text=vendor.tags;
			
$.detailsLbl.text = vendor.description;
$.linkLbl.text = vendor.facebook;
$.hrsValue.text = vendor.schedule + " " + vendor.hours;
var fields = vendor.hours.split("-");
var statusTime = fields[1];
$.statusValue.text = "Open until "+statusTime;

$.distanceValueLbl.text = Alloy.Globals.GetDistanceFromLocation(unit.latitude, unit.longitude);

function openMenuOrder(e) {
	var menuDetail = Alloy.createController('menuOrder', {
		orderSysId : vendor.order_sys_id,
		vendorName : vendor.name,
		companyId: vendor.id,
		deliveryCharge : delivery_charge_amount,
		delivery_charge_item_id:delivery_charge_item_id
	}).getView();
	menuDetail.open();
	//Alloy.Globals.tabConsumer.activeTab.open(menuDetail);
}

function openReviews(e) {
	//Alloy.Globals.baseView.add(Alloy.createController('reviewsScreen').getView());
	var reviewList = Alloy.createController('reviewsScreen').getView();
	reviewList.open();
	//Alloy.Globals.tabConsumer.activeTab.open(reviewList);
}

function openFavScreen(e) {
	
	/*Alloy.Globals.baseView.add(Alloy.createController('favorites').getView());
		var favoriteList = Alloy.createController('favorites').getView();
		favoriteList.open();
		Alloy.Globals.tabConsumer.activeTab.open(favoriteList);	*/
		if(fav_no == 0) {
			$.favImg.image = "/images/favorite_full.png";
			fav_no = 1;
		}else{
			$.favImg.image = "/images/favorite.png";
			fav_no = 0;
		}
		
		if(customer_id != ""){
			Alloy.Globals.Services.Vendor.SetFavorites(customer_id, function(resp) {
		    });
	    }else{
	    	alert("Please login to continue");
	    }
}

$.mapItLbl.addEventListener('click', function() {
	var mapRoute = Alloy.createController('mapRoute', {
		latitude : unit.latitude,
		longitude : unit.longitude
	}).getView();
	mapRoute.open();
});

