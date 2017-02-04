exports.createTimePicker = function(params) {
	var params = params || {};
	//Ti.API.info(" createTimePicker " + JSON.stringify(params));
	//var time = moment(params.time, 'hh:mm A').utc().unix();
	//Ti.API.info(" timestamp  for picker " + time);
	//Ti.API.info("  new Date(time)  "+ new Date(time));
	var timeView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
	});
	var picker = Ti.UI.createPicker({
		top : 0,
		height : Ti.UI.SIZE,
		type : Ti.UI.PICKER_TYPE_TIME,
		//value : new Date(time),
		backgroundColor : "#888888",
	});
	picker.addEventListener("change", function(e) {
		//Ti.API.info("timePicker Value " + JSON.stringify(e));
		var timestamp = Number(e.value).toString();
		params && params.timePickerCallBack && params.timePickerCallBack(timestamp);
	});

	timeView.add(picker);
	timeView.picker = picker;
	return timeView;
};
