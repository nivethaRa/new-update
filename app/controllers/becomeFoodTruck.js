$.backMenuIconView.addEventListener("click", function(){
  $.becomeFoodTruck.close();
});

Alloy.Globals.Cloud.Objects.query({
    classname: 'Tags'
}, function (e) {
      if (e.success) {
        var cloudTags = [];
        for (var i = 0; i < e.Tags.length; i++) {
          cloudTags.push(e.Tags[i].tag_name);
        };
        $.tagWidget.init(cloudTags);
      }
});


$.submitRequest.addEventListener("click", function(){
  if(!$.loyaltySwitch.value){
    alert(L("mustAcceptLoyalty"));
    return;
  }
  $.submitRequest.title = L("submitingRequest");
  $.submitRequest.enabled = false;
  if($.foodtruck_name.value == ""
    || $.phone.value == ""
    || $.address.value == ""
    || $.description.value == ""
    || $.bronzeReward.value == ""
    || $.silverReward.value == ""
    || $.goldReward.value == ""
    || $.typicalHoursOpen.getSelectedRow(0).value == "--"
    || $.typicalHoursClose.getSelectedRow(0).value == "--"
  ) {
    Alloy.Globals.simpleAlert(L("incomplete_data"));
    $.submitRequest.title = L("submitRequest");
    $.submitRequest.enabled = true;
    return;
  }

  var customFields = Alloy.Globals.currentUser.custom_fields;
  if(!customFields) {
    customFields = {};
  }
  var sliderValue = parseFloat($.pricingSlider.value);
  if(sliderValue < 0.20){
    customFields["pricing_range"] = 1;
  }else if(sliderValue < 0.50){
    customFields["pricing_range"] = 2;
  }else if(sliderValue < 0.80){
    customFields["pricing_range"] = 3;
  }else{
    customFields["pricing_range"] = 4;
  }
  customFields["foodtruck_name"] = $.foodtruck_name.value;
  customFields["phone"] = $.phone.value;
  customFields["address"] = $.address.value;
  customFields["description"] = $.description.value;
  customFields["bronze_reward"] = $.bronzeReward.value;
  customFields["silver_reward"] = $.silverReward.value;
  customFields["gold_reward"] = $.goldReward.value;
  customFields["typical_hours"] = $.typicalHoursOpen.getSelectedRow(0).value + " " + $.typicalHoursOpenAmPm.getSelectedRow(0).value + " - " +  $.typicalHoursClose.getSelectedRow(0).value + " " +  $.typicalHoursCloseAmPm.getSelectedRow(0).value;
  Alloy.Globals.currentUser.custom_fields = customFields;
  if($.tagWidget.getSelectedTags().length > 0 ){
    Alloy.Globals.currentUser.tags = $.tagWidget.getSelectedTags();
  }
  Alloy.Globals.Cloud.Users.update(Alloy.Globals.currentUser, function (e) {
      if (e.success) {
          var user = e.users[0];
          Alloy.Globals.Cloud.Emails.send({
              template: 'becomeFoodTruck',
              recipients: Alloy.CFG.foodtruck_request_email,
              user_id: user.id,
              foodtruck_role: Alloy.Globals.foodTruckRoleString
          }, function (e) {
              if (e.success) {
                Alloy.Globals.simpleAlert(L("becomeFoodTruckSuccess"), function(){
                  $.becomeFoodTruck.close();
                });
              } else {
                alert(L("submitRequestError"));
                $.submitRequest.title = L("submitRequest");
                $.submitRequest.enabled = true;
              }
          });
      } else {
          alert(L("submitRequestError"));
          $.submitRequest.title = L("submitRequest");
          $.submitRequest.enabled = true;
      }
  });

});

$.pricingLabel.text = L('pricing1');

$.pricingSlider.addEventListener('change', function(e) {
  var sliderValue = parseFloat(e.value);
  if(sliderValue < 0.20){
    $.pricingLabel.text = L('pricing1');
  }else if(sliderValue < 0.50){
    $.pricingLabel.text = L('pricing2');
  }else if(sliderValue < 0.80){
    $.pricingLabel.text = L('pricing3');
  }else{
    $.pricingLabel.text = L('pricing4');
  }
});

$.loyaltySwitch.addEventListener('change', function(e) {
  if($.loyaltySwitch.value){
    $.rewardContainer.setHeight(Ti.UI.SIZE);
  }else{
    $.rewardContainer.setHeight(0);
  }
});