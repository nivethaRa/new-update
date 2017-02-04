// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var toast = require("toast"),
    SFEZKeys = require("SFEZKeys");
(OS_IOS) ? ($.win.title = "Payment") : ($.winTitle.text = "Payment");
$.amountValueLabel.text = 'R$' + args.amount;
var creditCardDetails = Ti.App.Properties.getObject("CreditCardDetails", null);
Ti.API.info(creditCardDetails);
var isEditMode = false;
var selectedMonthIndex;
var selectedYearIndex;
if(creditCardDetails == null){
	creditCardDetails = {
	cardNo: "",
	expmonth: 0,
	year	: 0,
	cvv : "",
	cardholdername :"",
};
	isEditMode = true;
	$.cardNumField.value = "";
	selectedMonthIndex =  0;
	selectedYearIndex = 0;
	$.cardHolderNameField.value = "";
	$.cvcField.value  = "";
}
else{
	$.cardNumField.value = "xxxx-xxxx-xxxx-"+(creditCardDetails.cardNo).toString().slice(-4);
	selectedMonthIndex =  creditCardDetails.expmonth;
	selectedYearIndex = creditCardDetails.year;
	$.cardHolderNameField.value = creditCardDetails.cardholdername;
	$.cardNumField.editable = false;
	$.cvcField.value = creditCardDetails.cvv;
}

/*
 {
	cardNo: "",
	expmonth: "",
	year	: "",
	cvv : "",
	cardholdername :"",
}
 */
//var cardDetail = Alloy.Globals.getData(SFEZKeys.KEYS.CONSUMER_CARD_DETAIL);
//$.cardNumField.value = (cardDetail && cardDetail.cardNum) ? cardDetail.cardNum : "378282246310005";
//$.cardNumField.editable = false;
//$.cardHolderNameField.value = (cardDetail && cardDetail.cardHolderName) ? cardDetail.cardHolderName : "Sapna";
//var selectedMonthIndex = (cardDetail && cardDetail.mothPickerSelectedIndex) ? cardDetail.mothPickerSelectedIndex : 0;
//var selectedYearIndex = (cardDetail && cardDetail.yearPickerSelectedIndex) ? cardDetail.yearPickerSelectedIndex : 0;

function closeWindow() {
	$.getView().close();
}

//picker section

function getMonthPickerRowData() {
	var monthPickerData = ["Month", "01(Jan)", "02(Feb)", "03(Mar)", "04(Apr)", "05(May)", "06(June)", "07(July)", "08(Aug)", "09(Sep)", "10(Oct)", "11(Nov)", "12(Dec)"];
	var rows = [];
	for (var i = 0; i < monthPickerData.length; i++) {
		rows[i] = Ti.UI.createPickerRow({
			title : monthPickerData[i],
			backgroundColor : "#fff",
			color : "#000"
		});
	}
	return rows;
}

var monthPicker = Ti.UI.createPicker({
	top : 0,
	selectionIndicator : true,
	height : Titanium.UI.FILL,
	width : Titanium.UI.FILL
});
monthPicker.add(getMonthPickerRowData());

$.monthField.add(monthPicker);
$.monthField.monthPicker = monthPicker;
monthPicker.setSelectedRow(0, selectedMonthIndex, false);

function yearPicker(yearRange) {
	var picker = Ti.UI.createPicker();
	var yCol = Ti.UI.createPickerColumn();
	yCol.addRow(Ti.UI.createPickerRow({
		title : "Year"
	}));
	for (var i = yearRange.min; i <= yearRange.max; i++) {
		yCol.addRow(Ti.UI.createPickerRow({
			title : i.toString()
		}));
	}
	picker.add([yCol]);
	return picker;
}

var yearPicker = yearPicker({
	top : 0,
	selectionIndicator : true,
	height : Titanium.UI.FILL,
	width : Titanium.UI.FILL,
	min : 2016,
	max : 2060
});
yearPicker.selectionIndicator = true;
yearPicker.setSelectedRow(0, selectedYearIndex, false);

$.yearField.add(yearPicker);
$.yearField.yearPicker = yearPicker;

//validations

monthPicker.addEventListener('change', function(e) {
	//do your stuff here
	selectedMonthIndex = e.rowIndex;
});

yearPicker.addEventListener('change', function(e) {
	//do your stuff here
	selectedYearIndex = e.rowIndex;
});

var previousValue = "";
$.cardNumField.addEventListener('change', function(e) {
	if (previousValue == "" || (previousValue.length < this.value.length)) {
		if (e.value.length == 4) {
			this.value = e.value + "-";

		}
		if (e.value.length == 9) {
			this.value = this.value + "-";

		}
		if (e.value.length == 14) {
			this.value = this.value + "-";
		}
		if (OS_ANDROID) {
			$.cardNumField.setSelection($.cardNumField.value.length, $.cardNumField.value.length);
		}
	}
	previousValue = this.value;
	if (this.value.length == "") {
		previousValue = "";
	}
});

function applyValidations() {
	var isValid = true;
	if (!$.cardNumField.getValue()) {
		toast.show({
			message : "Please enter valid card number"
		});
		isValid = false;
		return isValid;
	}
	if ($.monthField.monthPicker.getSelectedRow(0).getTitle() == "Month" || $.yearField.yearPicker.getSelectedRow(0).getTitle() == "Year") {
		toast.show({
			message : "Expiration Date Required"
		});
		isValid = false;
		return isValid;
	}
	if (!$.cvcField.getValue()) {
		toast.show({
			message : "CVC/CVV required"
		});
		isValid = false;
		return isValid;
	}
	if (!$.cardHolderNameField.getValue()) {
		toast.show({
			message : "Please enter card holder name"
		});
		isValid = false;
		return isValid;
	}
	return isValid;
}

function hideKeyboard() {
	$.cardNumField.blur();
	$.cvcField.blur();
	$.cardHolderNameField.blur();
}
$.editLabel.addEventListener('click', function(e){
	isEditMode = true;
	$.cardNumField.value = "";
	$.cardNumField.editable = true;
	
});
$.save.addEventListener('click', function(e) {
	if (!applyValidations()) {
		return;
	}
	if(isEditMode){
		var cardHolderNum =  $.cardNumField.getValue();
	}
	else{
		var cardHolderNum = creditCardDetails.cardNo;
	}
	isEditMode = false;
	$.cardNumField.editable  = false;
	creditCardDetails = {
	cardNo: cardHolderNum,
	expmonth: selectedMonthIndex,
	year	: selectedYearIndex,
	cvv : $.cvcField.getValue(),
	cardholdername : $.cardHolderNameField.getValue(),
};
	Ti.App.Properties.setObject("CreditCardDetails",creditCardDetails);
	Alloy.Globals.setData(SFEZKeys.KEYS.CONSUMER_CARD_DETAIL, {
		cardNum :cardHolderNum,
		month : $.monthField.monthPicker.getSelectedRow(0).getTitle(),
		year : $.yearField.yearPicker.getSelectedRow(0).getTitle(),
		cvv : $.cvcField.getValue(),
		cardHolderName : $.cardHolderNameField.getValue(),
		amount : args.amount,
		mothPickerSelectedIndex : selectedMonthIndex,
		yearPickerSelectedIndex : selectedYearIndex
	});
	hideKeyboard();
	closeWindow();
	args.callback();
});
