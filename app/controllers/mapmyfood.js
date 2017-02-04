var utils = require("utils");
var args = arguments[0] || {};
function openVendorList() {
	utils.replaceCentralView({
		view : Alloy.createController('/vendorList',{customerID:args.customerID}).getView(),
		title : "Vendor List"
	});
}
function searchByLocationClicked() {
	var zipcode = $.postCode.value;
			if (zipcode.trim().length == 0 && $.postCode.visible) {
				alert("Please input your address");
			}
			else if (zipcode.trim().length > 0 && $.postCode.visible){
				Ti.Geolocation.forwardGeocoder(zipcode, function(e) {
					Ti.API.info(JSON.stringify(e));
				    if(e.code != 0){
				    	alert("Location not found");
				    }else{
				    	//alert("longitude : "+e.longitude+" latitude : "+e.latitude);
				    	Ti.API.info(JSON.stringify(e));
				    	var searchLoc = {
						    lat : e.latitude,
						    lng : e.longitude,
						    customerID:args.customerID
						};
						utils.replaceCentralView({
							view : Alloy.createController('/vendorList',searchLoc).getView(),
							title : "Vendor List"
						});
				    }
				});
				return;
			} 
			else {
				
				//alert("Else");
				return;
				var filterdSites = [];
				//find out match zipcode site
				for (var i = 0; i < AllSites.length; i++) {
					var site = AllSites[i];
					if (zipcode == site.zipcode) {
						filterdSites.push(site);
					}
				};
				if (filterdSites.length > 0) {
					var secondLevelWindow = Alloy.createController("/consumer/mapmyfoodcontroller", {
						AllSites : filterdSites
					}).getView();
					Alloy.Globals.tabConsumer.activeTab.open(secondLevelWindow);
				} else {
					alert("No results found on postal code");
				}
			}
	}
