var SFEZKeys = require("SFEZKeys");
var lastObj = $.f1Radio;
var searObj = $.fstRadio;

var utils = require("utils");

$.postCode.visible = false;
var searchPref = {
	distance : "2"
};

function Radio1Cliked() {
	$.sndRadio.image = "/images/radio_off.png";
	$.fstRadio.image = "/images/radio_on.png";
	$.postCode.visible = false;
}

function Radio2Cliked() {
	$.fstRadio.image = "/images/radio_off.png";
	$.sndRadio.image = "/images/radio_on.png";
	$.postCode.visible = true;
}
searObj.image = "/images/radio_on.png";
lastObj.image = "/images/radio_on.png";

$.ck1.image = "/images/check_on.png";
function RadioBtnCliked(e) {
	lastObj.image = "/images/radio_off.png";
	lastObj.isCheck = false;
	if (e.source.isCheck) {
		e.source.image = "/images/radio_off.png";
		e.source.isCheck = false;
	} else {
		e.source.image = "/images/radio_on.png";
		e.source.isCheck = true;
	}
	lastObj = e.source;
}

function UpdateCheckBox(e) {
	if (!e.source.idCheck) {
		e.source.idCheck = true;
		e.source.image = "/images/check_on.png";
	} else {
		e.source.idCheck = false;
		e.source.image = "/images/check_off.png";
	}
}

var fileName = 'data/sfez.json';
var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + fileName);
var sites = JSON.parse(file.read().text).sites;
var companies = JSON.parse(file.read().text).companies;
var AllSites = [];
for (var i = 0; i < sites.length; i++) {
	var site = sites[i];
	for (var j = 0; j < companies.length; j++) {
		var company = companies[j];
		if (site.company == company.id) {
			site.company = company;
			break;
		}
	}
	AllSites.push(site);
}

function stepThreeNext() {
	$.viewOne.visible = false;
	$.viewTwo.visible = false;
	$.viewThree.visible = false;
	$.viewFour.visible = true;
}

function searchPrefClicked() {
	// $.viewTwo.visible = false;
	// $.viewThree.visible = false;
	// $.viewFour.visible = false;
	// $.viewOne.visible = true;
	// Alloy.Globals.baseHomeView.add(Alloy.createController('/foodtruck/registration/preview').getView());
}

$.distanceLabel.text = L('distance0');

var getSearchPref = Alloy.Globals.getData(SFEZKeys.KEYS.CUSTOMER_SEARCH_PREF);
if (getSearchPref != null) {
	if (getSearchPref.distance != undefined) {
		if (getSearchPref.distance == 0.5) {
			$.distanceSlider.value = 0.10;
		} else if (getSearchPref.distance == 1) {
			$.distanceSlider.value = 0.45;
		} else if (getSearchPref.distance == 2) {
			$.distanceSlider.value = 0.70;
		} else if (getSearchPref.distance == 5) {
			$.distanceSlider.value = 0.90;
		} else {
			$.distanceSlider.value = 1;
		}
	} else {
		$.distanceSlider.value = 0.70;
		searchPref.distance = 2;
		Alloy.Globals.setData(SFEZKeys.KEYS.CUSTOMER_SEARCH_PREF, searchPref);
	}
} else {
	$.distanceSlider.value = 0.70;
	searchPref.distance = 2;
	Alloy.Globals.setData(SFEZKeys.KEYS.CUSTOMER_SEARCH_PREF, searchPref);
}

$.distanceSlider.addEventListener('change', function(e) {
	var sliderValue = parseFloat(e.value);
	if (sliderValue < 0.10) {
		$.distanceLabel.text = L('distance0');
		searchPref.distance = 0.5;
	} else if (sliderValue < 0.45) {
		$.distanceLabel.text = L('distance1');
		searchPref.distance = 1;
	} else if (sliderValue < 0.70) {
		$.distanceLabel.text = L('distance2');
		searchPref.distance = 2;
	} else if (sliderValue < 0.90) {
		$.distanceLabel.text = L('distance3');
		searchPref.distance = 5;
	} else {
		$.distanceLabel.text = L('distance4');
		searchPref.distance = 10;
	}
	Ti.API.info("searchPref.distance", searchPref.distance);
	Alloy.Globals.setData(SFEZKeys.KEYS.CUSTOMER_SEARCH_PREF, searchPref);
});

function MapMyFoodClicked() {
	var secondLevelWindow = Alloy.createController("/consumer/mapmyfoodcontroller", {
		AllSites : AllSites
	}).getView();
	Alloy.Globals.tabConsumer.activeTab.open(secondLevelWindow);
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
				    lng : e.longitude
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

