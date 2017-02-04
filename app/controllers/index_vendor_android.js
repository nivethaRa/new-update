
Alloy.Globals.tabVendor = $.tabVendor;

function menuNavButtonHandler(e)
{
  	$.mainWindow.open();
	$.sidemenuVendor.animate({left:0, duration:200});
}

$.sidemenuVendor.addEventListener('swipe', function(e){
	var direction = e.direction;

    if (direction == "left")
    {
  			$.sidemenuVendor.animate({left:-250, duration:200},function(){
    			$.mainWindow.hide();	
    		});
    };
});

function checkOutNavButtonHandler(e){
  alert('Open checkout');
}

//option clicked event 
function clickedOption(e)
{ 
	var option = e.source.id;
	
	if (option == 'Consumer') 
	{
		$.mainWindow.close();
		Ti.App.Properties.setString('lastRole', 'Consumer');
		Ti.App._restart();
	}
	//alert(e.source.id);
	if(option == 'Profile'){
		
	}
	if(option == 'SignIn')
	{
		var loginControl = Alloy.createController('login').getView();
		loginControl.open();
		$.mainWindow.close();
		// var nav = Titanium.UI.iOS.createNavigationWindow({
                   // window: loginControl,
                   // modal:true
                // });
		// nav.open();
		// Alloy.Globals.Nav = nav;
	}
	if(option == 'CAccount'){
		var registerControl = Alloy.createController('registration').getView();
		registerControl.open();
		$.mainWindow.close();
		// var nav = Titanium.UI.iOS.createNavigationWindow({
                   // window: registerControl,
                   // modal:true
                // });
		// nav.open();
		// Alloy.Globals.Nav = nav;
		//registerControl.open();
	}
	
	//Vendor menu clicks 
	if(option == 'CheckIn'){
		tabVendor.setActiveTab(0);
		$.mainWindow.close();
	}
	if(option == 'DailyVSpecial'){
		tabVendor.setActiveTab(1);
		$.mainWindow.close();
	}
	if(option == 'MenuAvailable'){
		var menuAvailabilityControl = Alloy.createController('/foodtruck/menuAvailability').getView();
		menuAvailabilityControl.open();
		$.mainWindow.close();
	}
	if(option == 'Report'){
		tabVendor.setActiveTab(3);
		$.mainWindow.close();
	}
	if(option == 'Review'){
		var reviewControl = Alloy.createController('reviewsScreen').getView();
		reviewControl.open();
		$.mainWindow.close();
	}
	if(option == 'Config'){
		var configControl = Alloy.createController('/foodtruck/configuration').getView();
		configControl.open();
		$.mainWindow.close();
	}
  				
  	$.sidemenuVendor.animate({left:-250, duration:200},function(){
    	$.mainWindow.hide();	
    });
}

var tabVendor = Alloy.Globals.tabVendor; 

tabVendor.show();

tabVendor.activeTab.caption.color = Alloy.Globals.navBarColor;

Ti.App.addEventListener('openSidemenu', function(e)
{
  	//$.mainWindow.open();
  $.mainWindow.open();
  // var role =  Ti.App.Properties.getString('lastRole');
  // if(role == "Consumer")
  // {
  //	$.sidemenu.animate({left:0, duration:200});	
  //}else{
  $.sidemenuVendor.animate({left:0, duration:200});
  //}
  //	$.sidemenuVendor.animate({left:0, duration:200});
});





