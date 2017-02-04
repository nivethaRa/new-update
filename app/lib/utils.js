exports.replaceCentralView = function(params) {
	var slider = Alloy.Globals.slider;
	var mainView = Alloy.Globals.centralView;
	var replacedView = params.view;
	if (mainView && mainView.windowView && mainView.children[0]) {
		mainView.remove(mainView.windowView);
		mainView.windowView = null;
	}
	if (Alloy.Globals.actionBar) {
		var _title = params.title || "";
		Alloy.Globals.actionBar.setTitle(_title);
	}
	mainView.height = Ti.UI.FILL;
	mainView.add(replacedView);
	mainView.windowView = replacedView;
	slider = null;
	mainView = null;
	replacedView = null;
};

exports.hyperLinkOfText = function(lbl, textColor) {
	var text = lbl.text;
	var attr = Ti.UI.iOS.createAttributedString({
		text : text,
		attributes : [{
			type : Ti.UI.iOS.ATTRIBUTE_UNDERLINES_STYLE,
			value : Titanium.UI.iOS.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
			range : [0, text.length]
		}, {
			type : Ti.UI.iOS.ATTRIBUTE_FOREGROUND_COLOR,
			value : textColor || "blue",
			range : [0, text.length]
		}],

	});

	lbl.attributedString = attr;

	text = null;
	attr = null;
};