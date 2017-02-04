var args = arguments[0] || {};
var menuItem = args.menuItem;
$.quantity.text = menuItem.quantity;
$.name.text = menuItem.name;
$.description.text = menuItem.description;
$.price.text = "R" + menuItem.price;


Alloy.Globals.Services.Vendor.GetMenuImage(args.companyId,menuItem.productId, function(resp) {
	  Ti.API.info("*Resp******* " + resp);
	for (var j = 0; j < resp.images.length; j++) {
	    MenuImage = resp.images[j].url.https;
	    Ti.API.info("*MenuImage******* " + MenuImage);
	    $.itemPic.image = MenuImage;
	    Ti.API.info("***menu--image*** " +MenuImage);
	}
});
//alert(menuItem.productId);
var views = {};

//Animation Durations
var smallDuration = 250;
var bigDuration = 250;
var normalDuration = 150;
var singleSelectViews = [],
    multipleSelectViews = [],
    extrasSelectViews = [],
    single = [],
    multiple = [],
    extras = [];

//Animations Transformations
var small = Ti.UI.create2DMatrix({
	scale : 0.05
});
var big = Ti.UI.create2DMatrix({
	scale : 1.2
});
var normal = Ti.UI.create2DMatrix({
	scale : 1
});

//Open with Style
(function() {
	//Change the message of popup after getting value
	//Ti.API.info("you are not connected to internet");
	var proceedAnimations = function() {
		$.popupBox.animate({
			duration : bigDuration,
			transform : big
		}, function() {
			$.popupBox.animate({
				duration : normalDuration,
				transform : normal
			});
		});
	};
	if (OS_ANDROID) {
		$.hazeViewContainer.visible = false;
		$.popupBox.animate({
			duration : smallDuration,
			transform : small
		}, function() {
			$.hazeViewContainer.visible = true;
			proceedAnimations();
		});
		return;
	}
	$.popupBox.transform = small;
	proceedAnimations();
})();

//Close with Style
var closeWithStyle = function() {
	$.popupBox.animate({
		duration : 300,
		transform : big
	}, function() {
		$.popupBox.animate({
			duration : smallDuration,
			transform : small
		}, function() {
			$.hazeViewContainer.close();
		});
	});
};

function clickOutSide() {
	closeWithStyle();
}

if (OS_ANDROID) {
	function closeWin(evt) {
		$.getView().close();
	}

}

function getMultipleOptions(data, _variationId, _title) {
	Ti.API.info("****************getMultipleOptions***1******** " + JSON.stringify(data));
	var multipleSelectView = Ti.UI.createView({
		top : 10,
		left : 0,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		layout : 'horizontal',
		modifierId : data.modifier,
		variationId : _variationId
	});
	var checkbox = $.UI.create('ImageView', {
		classes : ["radioBtn"],
		image : "/images/check_off.png",
		bubbleParent : true,
		idCheck : false
	});
	var variationName = $.UI.create('Label', {
		text : data.title+"("+data.difference+")",
		left : 20,
		font : {
			fontSize : 15,
			fontFamily : 'Lucida Grande',
		},
		color : "#000",
		ubbleParent : true
	});
	multipleSelectView.add(checkbox);
	multipleSelectView.add(variationName);
	multipleSelectView.checkbox = checkbox;
	multipleSelectView.variationName = variationName;
	multipleSelectView.addEventListener('click', function(e) {
		if (!this.checkbox.idCheck) {
			this.checkbox.idCheck = true;
			this.checkbox.image = "/images/check_on.png";
			var params = {};
			/*params["modifier_id"] = this.modifierId;*/
			params[this.modifierId] = this.variationId;
			(_title == "Extras") ? extras.push(params) : multiple.push(params);

		} else {
			this.checkbox.idCheck = false;
			this.checkbox.image = "/images/check_off.png";
			var alreadyExist = false,
			    arr = [];
			(_title == "Extras") ? ( arr = extras) : ( arr = multiple);
			for (var i = 0; i < arr.length; i++) {
				for (var key in arr[i]) {
					if (arr[i][key] == this.variationId) {
						alreadyExist = true;
						arr.splice(i, 1);
						break;
					}
				}
				if (alreadyExist) {
					(_title == "Extras") ? ( extras = arr) : ( multiple = arr);
					break;
				}
			}
			Ti.API.info("**multipleSelectView** " + this.modifierId + " " + this.variationId);
		}
	});
	return multipleSelectView;
}

function populateOptionItems(_item, title) {
	Ti.API.info("**<----populateOptionItems---->** " + JSON.stringify(_item));
	if (!_item.variations) {
		return;
	}
	var mainView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		layout : "vertical"
	});
	var othersLabel = Ti.UI.createLabel({
		top : 10,
		text : title,
		color : "#000",
		font : {
			fontSize : 16,
			fontFamily : 'Lucida Grande',
			fontWeight : "bold"
		},
		left : 0,
	});
	mainView.add(othersLabel);
	var i = 0;
	for (var key in _item.variations) {
		mainView.add(getMultipleOptions(_item.variations[key], key, title));
		i++;
	}
	if (title == "Extras") {
		extrasSelectViews.push(mainView);
	} else {
		multipleSelectViews.push(mainView);
	}
}

function getSingleSelectPickerRowData(_item) {
	var rows = [];
	rows[0] = Ti.UI.createPickerRow({
		title : "Select One",
	});
	var i = 1;
	for (var key in _item) {
		Ti.API.info("**********getSingleSelectPickerRowData*************** " + key);
		rows[i] = Ti.UI.createPickerRow({
			title : _item[key].title,
			modifierId : _item[key].modifier,
			variationId : key
		});
		i++;
	}
	return rows;
}

function populateSingleSelect(singleSelectModifiers) {
	if (!singleSelectModifiers.title || !singleSelectModifiers.variations) {
		return;
	}
	var mainView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		layout : "vertical"
	});
	var categoryLabel = Ti.UI.createLabel({
		left : 0,
		top : 10,
		text : singleSelectModifiers.title,
		color : "#000",
		font : {
			fontSize : 16,
			fontFamily : 'Lucida Grande',
			fontWeight : "bold"
		}
	});
	var pickerView = Ti.UI.createView({
		left : 0,
		top : 10,
		height : 40,
		backgroundColor : "#D5D4D4",
	});
	var picker = Ti.UI.createPicker({
		top : 0,
		selectionIndicator : true,
		height : Titanium.UI.FILL,
		width : Titanium.UI.FILL
	});
	picker.add(getSingleSelectPickerRowData(singleSelectModifiers.variations));
	pickerView.add(picker);
	picker.setSelectedRow(0, 0, false);
	mainView.add(categoryLabel);
	mainView.add(pickerView);
	singleSelectViews.push(mainView);
	picker.addEventListener('change', function(e) {
		Ti.API.info("*************picker****1************** " + JSON.stringify(e));
		var index = e.rowIndex;
		single = [];
		Ti.API.info("*************picker*****2************* " + e.source.columns[0].children[index].modifierId + " " + e.source.columns[0].children[index].variationId);
		if (_.isUndefined(e.source.columns[0].children[index].modifierId)) {
			return;
		}
		var params = {};
		params[e.source.columns[0].children[index].modifierId] = e.source.columns[0].children[index].variationId;
		single.push(params);
	});
}

function populateViews(_views) {
	$.dynamicSeparator.show();
	$.dynamicSeparator.setTop("10");
	for (var i = 0; i < _views.length; i++) {
		$.dynamicView.height = Ti.UI.SIZE;
		$.dynamicView.add(_views[i]);
	}
}

function dynamicView(modifiers) {
	_.each(modifiers, function(item, index) {
		Ti.API.info("*********dynamicView***********inside for each****1******* " + JSON.stringify(item));
		//read key
		for (var key in item) {
			var view;
			switch(item[key].title) {
			case "Extras":
				view = populateOptionItems(item[key], "Extras");
				views["ExtrasView"] = view;
				break;
			case "OptionItems":
				view = populateOptionItems(item[key], "Others");
				views["OptionItemsView"] = view;
				break;
			default:
				view = populateSingleSelect(item[key]);
				views["SingleSelectView"] = view;
				break;
			}
		}
	});
	//populate views
	if (singleSelectViews.length > 0) {
		populateViews(singleSelectViews);
	}
	if (multipleSelectViews.length > 0) {
		populateViews(multipleSelectViews);
	}
	if (extrasSelectViews.length > 0) {
		populateViews(extrasSelectViews);
	}
}

(menuItem.isModifier) && dynamicView(menuItem.modifiers);

function increaseQuantity() {
	$.quantity.text = Number($.quantity.getText()) + Number(1);
}

function decreaseQuantity() {
	if ($.quantity.getText() == 1) {
		return;
	}
	$.quantity.text = Number($.quantity.getText()) - Number(1);
}

function saveUpdate() {
	closeWithStyle();
	var params = {};
	if (single.length > 0) {
		params['single'] = single;
	}
	if (multiple.length > 0) {
		params['multiple'] = multiple;
	}
	if (extras.length > 0) {
		params['extras'] = extras;
	}
	Ti.API.info("****saveUpdate**** " + JSON.stringify(params));
	args.callback($.quantity.text, params);
}
