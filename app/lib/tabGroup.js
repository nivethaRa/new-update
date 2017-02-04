// global vars
var tabGroup, win;

// creates an iOS style navbar with title, back support.
function createNavBar(w) {

	var navBar = Ti.UI.createView({
		height : OS_IOS ? 65 : 65,
		top : 0,
		backgroundColor : Alloy.Globals.navBarColor
	});

	var back = Ti.UI.createButton({
		left : 15,
		top : 6,
		visible : true,
		height:30,
		width:30,
		backgroundColor:"transparent",
		backgroundImage:"images/tabicons/menu.png"
	});
	back.addEventListener("click", function(e) {
		Ti.App.fireEvent('openSidemenu');
	});
	var centerView = Ti.UI.createView('View', {
			left : 50,
			height : 65,
			top : 0,
			right:50,
			textAlign:"center"
	});
	var iconImg = Ti.UI.createImageView({
			height : 60,
			width : 60,
			top : -10,
			image : "/images/appicon60.png"
		});
	centerView.add(iconImg);
	
	var right = Ti.UI.createButton({
		right : 15,
		top : 6,
		height:30,
		width:30,
		backgroundColor:"transparent",
		backgroundImage : "/images/tabicons/cart.png",
		visible : true
	});

	w.leftNavButton = back;
	w.rightNavButton = right;
	
	navBar.add(back);
	//navBar.winTitle = winTitle;
	navBar.add(centerView);
	navBar.add(right);

	w.navBar = navBar;
	w.add(navBar);
}

// creates an iOS style navbar with title, back support.
function createNavBarInner(w) {

	var navBar = Ti.UI.createView({
		height : OS_IOS ? 65 : 50,
		top : 0,
		backgroundColor : Alloy.Globals.navBarColor
	});

	var back = Ti.UI.createButton({
		left : 15,
		top : 6,
		height:30,
		width:30,
		backgroundColor:"transparent",
		backgroundImage : "/images/tabicons/back.png",
		visible : true
	});

	var winTitle = Ti.UI.createLabel({
		top : 10,
		color : w.navTextColor || "#000",
		font : {
			fontWeight : "bold",
			fontSize : 18
		},
		text : w.title
	});

	w.leftNavButton = back;

	navBar.add(back);
	navBar.winTitle = winTitle;
	navBar.add(winTitle);

	w.navBar = navBar;
	w.add(navBar);
}

// create our tabGroup
exports.createTabGroup = function(args) {

	if (OS_IOS) {
	var tabgroup = Ti.UI.createTabGroup(args);
  	tabgroup.tabsBackgroundColor =  "#222222";
  	//tabgroup.tabsBackgroundDisabledColor =  "#222222";
  	//tabgroup.tabsBackgroundFocusedColor =  "yellow";
  	//tabgroup.activeTabBackgroundImage = "images/activetab.png";
    return tabgroup;
	}

	// host heavyweight window
	win = Ti.UI.createWindow(args);

	// create the nav bar
	createNavBar(win);

	// tabgroup is a view
	tabGroup = Ti.UI.createView({
		height : 55,
		bottom : 0,
		layout : "horizontal",
		backgroundColor : "#222222",//args.tabsBackgroundColor || "#CCC",
		backgroundImage : args.tabsBackgroundImage || null
	});

	win.add(tabGroup);

	// open the tabGroup window
	tabGroup.open = function() {
		win.open();
	};
	
	tabGroup.setActiveTab = function(index){
		args.tabs[index].window.visible = true;
		tabGroup.activeTab = args.tabs[index];
	};

	
	// position the tabs based on count / %age
	args.tabs.forEach(function(tab) {
		
		tabGroup.add(tab);
		tab.setWidth((99 / args.tabs.length) + "%");

		tab.window.top = 45;
		tab.window.bottom = 55;
		tab.window.visible = false;

		win.add(tab.window);

		tab.window.children.forEach(function(child) {
			tab.window.add(child);
		});

	});

	args.tabs[0].window.visible = true;

	//win.navBar.winTitle.text = args.tabs[0].window.title;
	
	//win.navBar.winTitle.color = args.tabs[0].window.navTextColor;

	// set our default (first) tab
	var lastTab = args.tabs[0];

	// set initial highlights / active elements
	lastTab.icon.__backgroundImage = lastTab.icon.backgroundImage;
	lastTab.caption.__color = lastTab.caption.color;

	lastTab.icon.backgroundImage = lastTab.icon.backgroundActiveImage;
	lastTab.caption.color = lastTab.activeColor;

	//win.navBar.backgroundColor = lastTab.window.barColor || "#ccc";

	tabGroup.activeTab = args.tabs[0];

	// clicking a tab
	tabGroup.addEventListener("click", function(e) {

		// if we have a lastTab, reset it
		if (lastTab) {
			lastTab.window.visible = false;
			lastTab.icon.backgroundImage = lastTab.icon.__backgroundImage;
			lastTab.caption.color = lastTab.caption.__color;
		}

		// make the tab window visible

		e.source.window.visible = true;

		// set the activeTab property
		tabGroup.activeTab = e.source;

		// hightlight the caption / icon
		e.source.icon.__backgroundImage = e.source.icon.backgroundImage;
		e.source.icon.backgroundImage = e.source.icon.backgroundActiveImage;

		e.source.caption.__color = e.source.caption.color;
		e.source.caption.color = e.source.activeColor;

		// set the title to the current view title
		//win.navBar.winTitle.text = e.source.window.title;
		//win.navBar.backgroundColor = e.source.window.barColor || "#ccc";
		//win.navBar.winTitle.color = e.source.window.navTextColor;

		// emulate the focus event
		tabGroup.fireEvent("focus", {
			type : "focus",
			previousTab : lastTab,
			previousIndex : _.indexOf(args.tabs, lastTab),
			tab : e.source,
			index : _.indexOf(args.tabs, e.source),
			source : tabGroup
		});

		// save the current / last tab selected
		lastTab = e.source;

	});

	return tabGroup;
};

exports.createTab = function(args) {

	if (OS_IOS) {
		var tab = Ti.UI.createTab(args);
  		tab.activeTitleColor = "#67C5EB";
  		tab.tintColor = "#67C5EB";
  		tab.titleColor = "white";
  		tab.iconIsMask = false;
  		tab.activeIconIsMask = false;
    	return tab;
	}

	// create an instance of a tab
	var tab = Ti.UI.createView(args);

	// if we have an icon, use it
	if (args.icon) {
		var icon = Ti.UI.createView({
			backgroundImage : args.icon,
			backgroundActiveImage : args.activeIcon,
			width : 26,
			height : 26,
			color : "#F00",
			top : 6,
			touchEnabled : false
		});
	}

	// create the caption
	var caption = Ti.UI.createLabel({
		text : args.title,
		color : args.color || "white",
		activeColor : "#67C5EB",
		bottom : 2,
		font : {
			fontSize : 11
		},
		touchEnabled : false
	});

	// cache the icon / caption against the tab, easier to get at later
	tab.icon = icon;
	tab.caption = caption;

	tab.add(icon);
	tab.add(caption);

	tab.open = function(args) {
		// double check we're dealing with a window
		if (args.toString().indexOf("TiUIWindow")) {

			createNavBarInner(args);

			//args.leftNavButton.title = "‹ " + tabGroup.activeTab.title;

			args.leftNavButton.visible = true;

			args.leftNavButton.addEventListener("click", function() {
				args.close();
				args = null;
			});

			args.open();
		} else {
			// throw the developer a bone
			throw "You need to pass a TiUIWindow";
		}

	};

	return tab;
};

exports.createWindow = function(args) {

	if (OS_IOS) {
		return Ti.UI.createWindow(args);
	}

	var win = Ti.UI.createView(args);

	return win;
};
