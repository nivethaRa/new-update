var currentTab = $.tab1;

var lineView = Ti.UI.createView({
	top : 0,
	height : 2,
	backgroundColor : Alloy.Globals.buttonColor3,
});

currentTab.add(lineView);
if (OS_IOS) {
	lineView.width = currentTab.children[0].toImage().width;
	currentTab.children[0].color = Alloy.Globals.buttonColor3;
}
function changeTabs(e) {
	Ti.API.info('inf  ' + JSON.stringify(e));
	if (OS_IOS) {
		currentTab.remove(lineView);
		currentTab.children[0].color = Alloy.Globals.normalTextColor;
		lineView.width = e.source.children[0].toImage().width;
		if (e.source.mid == "t1") {
			currentTab = e.source;
		} else if (e.source.mid == "t2") {
			currentTab = e.source;
		} else if (e.source.mid == "t3") {
			currentTab = e.source;
		} else if (e.source.mid == "t4") {
			currentTab = e.source;
		}
		e.source.children[0].color = Alloy.Globals.buttonColor3;
		currentTab.add(lineView);
	}
}

if (OS_ANDROID) {
	$.lineWeb.scalesPageToFit = true;
	$.pieWeb.scalesPageToFit = true;
	var lineUrl = Titanium.Filesystem.getResourcesDirectory() + 'column3D.html';
	var file1 = Titanium.Filesystem.getFile(lineUrl);
	$.lineWeb.url = file1.nativePath;
	var pieUrl = Titanium.Filesystem.getResourcesDirectory() + 'pieSimple.html';
	var file2 = Titanium.Filesystem.getFile(pieUrl);
	$.pieWeb.url = file2.nativePath;
} else {
	$.lineWeb.url = 'column3D.html';
	$.pieWeb.url = 'pieSimple.html';
}
