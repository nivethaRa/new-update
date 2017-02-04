var SFEZKeys = require("SFEZKeys");
var userInfo = Alloy.Globals.getData(SFEZKeys.KEYS.LOGGED_IN_USERS_INFO);

Ti.API.info("*UserInfo** " + JSON.stringify(userInfo));
$.pcsLbl.text = userInfo.company.name;
var display_name = userInfo.checkIn.display_name;
if(display_name != null){
    $.foodParkName.text = "Food Park/Location: " + userInfo.checkIn.food_park_name +"("+display_name+")" ;
}else{
	$.foodParkName.text = "Food Park/Location: " + userInfo.checkIn.food_park_name;
}

function locationCheckout() {

}
