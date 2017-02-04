// Arguments passed into this controller can be accessed via the `$.args` object directly or:

Alloy.Globals.tabConsumer = $.tabConsumer;//getView();

// $.tab_search.barColor = Alloy.Globals.navBarColor;
// $.tab_vender.barColor = Alloy.Globals.navBarColor;
// $.tab_loyalty.barColor = Alloy.Globals.navBarColor;
// $.tab_favorites.barColor = Alloy.Globals.navBarColor;
// $.tab_orders.barColor = Alloy.Globals.navBarColor;

function menuNavButtonHandler(e)
{
  $.mainWindow.open();
  $.sidemenu.animate({left:0, duration:200});	
}

$.sidemenu.addEventListener('swipe', function(e){
	var direction = e.direction;

    if (direction == "left")
    {
    	var role =  Ti.App.Properties.getString('lastRole');
    	if(role == "Consumer")
  		{			
  			$.sidemenu.animate({left:-250, duration:200},function(){
    			$.mainWindow.close();	
    		});
  		}else{
  			$.sidemenuVendor.animate({left:-250, duration:200},function(){
    			$.mainWindow.close();		
    		});
  		}
    	// if(Alloy.Globals.Services.User.role == "Consumer")
  		// {			
  			// $.sidemenu.animate({left:-250, duration:200},function(){
    			// $.mainWindow.close();	
    		// });
  		// }else{
  			// $.sidemenuVendor.animate({left:-250, duration:200},function(){
    			// $.mainWindow.close();		
    		// });
  		// }
    };
});

function checkOutNavButtonHandler(e){
  alert('Open checkout');
}


//option clicked event 
function clickedOption(e)
{ 
	var option = e.source.id;
	//alert(e.source.id);
	if (option == 'Vendor') 
	{
		$.mainWindow.close();
		Ti.App.Properties.setString('lastRole', 'Vendor');
		Ti.App._restart();
	}
	
	if(option == 'Profile'){
		
	}
	if(option == 'DailySpecial'){
		tabConsumer.setActiveTab(3);
	}
	if(option == 'Favorites'){
		var favoriteList = Alloy.createController('favorites').getView();
		Alloy.Globals.tabConsumer.activeTab.open(favoriteList);
		$.mainWindow.close();
	}
	if(option == 'Events'){
		var events = Alloy.createController('events').getView();
		Alloy.Globals.tabConsumer.activeTab.open(events);
		$.mainWindow.close();
	}
	if(option == 'MyLoyalty'){
		tabConsumer.setActiveTab(2);
	}
	if(option == 'SearchPref'){
		// var searchPrefControl = Alloy.createController('/consumer/searchPref').getView();
		// searchPrefControl.open();
		// var searchPrefControl = Alloy.createController("/consumer/searchPref").getView();
		// Alloy.Globals.tabConsumer.activeTab.open(searchPrefControl);
	}
	if(option == 'MapMyFood'){
		var mapmyfood = Alloy.createController('mapmyfood').getView();
		Alloy.Globals.tabConsumer.activeTab.open(mapmyfood);
	}
	if(option == 'SignIn'){
		var loginControl = Alloy.createController('login').getView();
		loginControl.open();
	}
	if(option == 'CAccount'){
		var registerControl = Alloy.createController('registration').getView();
		registerControl.open();
	}
	
	//Vendor menu clicks 
	if(option == 'CheckIn'){
		tabVendor.setActiveTab(0);
	}
	if(option == 'DailyVSpecial'){
		tabVendor.setActiveTab(1);
	}
	if(option == 'MenuAvailable'){
		
	}
	if(option == 'Report'){
		tabVendor.setActiveTab(3);
	}
	if(option == 'Review'){
		
	}
  	var role =  Ti.App.Properties.getString('lastRole');
  	if(role == "Consumer")
  	{
  		$.sidemenu.animate({left:-250, duration:200},function(){
    		$.mainWindow.close();	
    	});
    	//vipin 
    	// var registerControl = Alloy.createController('/foodtruck/checkins/checkin_first').getView();
    	// var registerControl = Alloy.createController('/foodtruck/registration/registration').getView();
		// registerControl.open();
		//end
  	}else{
  		$.sidemenuVendor.animate({left:-250, duration:200},function(){
    		$.mainWindow.close();		
    	});
  	}
	// if(Alloy.Globals.Services.User.role == "Consumer")
  	// {
  		// $.sidemenu.animate({left:-250, duration:200},function(){
    		// $.mainWindow.close();	
    	// });
    	// //vipin 
    	// // var registerControl = Alloy.createController('/foodtruck/checkins/checkin_first').getView();
    	// // var registerControl = Alloy.createController('/foodtruck/registration/registration').getView();
		// // registerControl.open();
		// //end
  	// }else{
  		// $.sidemenuVendor.animate({left:-250, duration:200},function(){
    		// $.mainWindow.close();		
    	// });
  	// }
}

var tabConsumer       = Alloy.Globals.tabConsumer,
    menu            = null,
    action_bar      = $.actionbar,
    TAB_A_BTN       = 1,
    TAB_B_BTN       = 2,
    TAB_C_BTN       = 3,
    TAB_D_BTN       = 4,
    TAB_E_BTN       = 5;

function androidShowMenuItem(item_id)
{
  // if(OS_ANDROID && menu != null){
    // // First loop through and hide anything that's showing, then 
    // // enable the one we want (so we don't get flickering indentation)
    // var selected = null;
    // _.each(menu.items, function(menu_item, i) {
      // if(menu_item.itemId == item_id){
        // selected = menu_item;        
      // } else {
        // menu_item.setVisible(false);
      // }
    // });
    // if(selected){
      // selected.setVisible(true);
    // }
  // }
}

// Given the Android tabs are implemented as Views instead of Windows, 
// handle focus events manually
//
// Also, because we are using buttons in the action bar, show/hide them here
tabConsumer.addEventListener("focus", function(e) {
  var tab_id;
  try{
      // Handle tapping of a 'more' tab item on iOS to bring up a menu of other options (it doesn't fire e.tab)
     tab_id = (e.tab) ? e.tab.id : tabConsumer.activeTab.id;
  } catch(e){ return; } 
  tabConsumer.activeTab.caption.color = Alloy.Globals.navBarColor;
  
  if(tab_id == "tab_a"){
    if(OS_ANDROID) {  }
    //$.tab_a_view.focusView();
    androidShowMenuItem(TAB_A_BTN);
  } else if(tab_id == "tab_b"){
    if(OS_ANDROID) {  }
    //$.tab_b_view.focusView();
    androidShowMenuItem(TAB_B_BTN);
  }else if(tab_id == "tab_c"){
    if(OS_ANDROID) {  }
    //$.tab_b_view.focusView();
    androidShowMenuItem(TAB_C_BTN);
  }else if(tab_id == "tab_d"){
    if(OS_ANDROID) {  }
    //$.tab_b_view.focusView();
    androidShowMenuItem(TAB_D_BTN);
  }else if(tab_id == "tab_e"){
    if(OS_ANDROID) {  }
    //$.tab_b_view.focusView();
    androidShowMenuItem(TAB_E_BTN);
  }
});

tabConsumer.open();
tabConsumer.show();
tabConsumer.activeTab.caption.color = Alloy.Globals.navBarColor;

Ti.App.addEventListener('openSidemenu', function(e)
{
  $.mainWindow.open();
  // var role =  Ti.App.Properties.getString('lastRole');
  // if(role == "Consumer")
  // {
  $.sidemenu.animate({left:0, duration:200});	
  // }else{
  	// $.sidemenuVendor.animate({left:0, duration:200});
  // }
  // if(Alloy.Globals.Services.User.role == "Consumer")
  // {
  	// $.sidemenu.animate({left:0, duration:200});	
  // }else{
  	// $.sidemenuVendor.animate({left:0, duration:200});
  // }
});

//$.mainWindow.hide();
//$.mainWindow.open();




