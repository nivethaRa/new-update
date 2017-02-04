$.starwidget.init();
$.menuActivityIndicator.show();
$.reviewsActivityIndicator.show();
Alloy.Globals.loading.show(L("loading"), false);
var currentProfileID = arguments[0].user_id;

$.createReviewButtonView.addEventListener("click", function(){
    Alloy.createController('review', {user_id : currentProfileID}).getView().open();
});

$.requestJujoView.addEventListener("click", function(){
    Alloy.createController('requestJujo').getView().open();
});

var FTname;
var FTpic; //if we want to show the food truck image!

$.shareFacebookView.addEventListener("click", function(){
    //Alloy.Globals.loading.show(L("loading"), false);
    Alloy.Globals.Facebook.presentShareDialog({
        link: Alloy.CFG.redirect_share_url,
        title: L("app_name"),
        description:  String.format(L("facebook_share_description"), FTname),
        picture: Alloy.CFG.online_logo_url
    });
    //Alloy.Globals.loading.hide();
});

Alloy.Globals.Cloud.Users.show({
    "user_id": arguments[0].user_id,
}, function (e) {
    if (e.success) {
        var user = e.users[0];
        FTname = $.FTname.text = user.custom_fields["foodtruck_name"];
        $.FTDescription.text = user.custom_fields["description"];

        $.statusBronzeBadgeLabel.text = "0";
        $.statusSilverBadgeLabel.text = "0";
        $.statusGoldBadgeLabel.text = "0";
        $.returnPercentageLabel.text = "0";

        $.goldRewardLabel.text = user.custom_fields["gold_reward"];
        $.silverRewardLabel.text = user.custom_fields["silver_reward"];
        $.bronzeRewardLabel.text = user.custom_fields["bronze_reward"];

        if(user.custom_fields["pricing_range"] == 1){
            $.FTPrice.text = "$";
        }else if(user.custom_fields["pricing_range"] == 2){
            $.FTPrice.text = "$$";
        }else if(user.custom_fields["pricing_range"] == 3){
            $.FTPrice.text = "$$$";
        }else{
            $.FTPrice.text = "$$$$";
        }
        
        console.log(user.custom_fields);  

        if(user.custom_fields["jujo"]) {
          if(user.custom_fields["jujo"]["0"])
            $.statusBronzeBadgeLabel.text = user.custom_fields["jujo"]["0"];
          if(user.custom_fields["jujo"]["1"])
            $.statusSilverBadgeLabel.text = user.custom_fields["jujo"]["1"];
          if(user.custom_fields["jujo"]["2"])
            $.statusGoldBadgeLabel.text = user.custom_fields["jujo"]["2"];
            var totalCustomers = 0;
            var returnedCustomers = 0;
            for (var jujo in user.custom_fields["jujo"]) {
                if(jujo != 0 && jujo != 1 && jujo != 2){
                    totalCustomers += 1;
                    if(parseInt(user.custom_fields["jujo"][jujo]) > 1){
                        returnedCustomers += 1;
                    }
                }
                //console.log("Returned Customers: " + returnedCustomers + " Total Customers: " + totalCustomers);
                if(returnedCustomers != 0){
                    var returnPercentage = (returnedCustomers/totalCustomers) * 100;
                    //console.log("Returned: " + returnPercentage);
                    $.returnPercentageLabel.text = "" + returnPercentage.toFixed(0) + "%";
                }else{
                    $.returnPercentageLabel.text = "0%";
                }
                
            };
        }

        Alloy.Globals.Cloud.Photos.show({
            photo_id: user.photo_id
        }, function (e) {
            if (e.success) {
                var photo = e.photos[0];
                //Ti.API.info('Success:\n' + JSON.stringify(photo));
                FTpic = $.profileImage.image = photo.urls.original;
            } else {
                //Ti.API.info('Error:\n' +
                //    ((e.error && e.message) || JSON.stringify(e)));
            }
        });
        Alloy.Globals.loading.hide(L("loading"), false);
        $.menuActivityIndicator.setHeight(0);
        $.menuActivityIndicator.hide();
    } else {
        alert('Error:\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});

Alloy.Globals.Cloud.Reviews.query({
    page: 1,
    per_page: 10,
    user_id : arguments[0].user_id,
    order: "-power_reviewer"
}, function (e) {
    if (e.success) {
        if (e.reviews.length > 0) {
            var avg = 0;
            var reviewsViews = [];
            for (var i = 0; i < e.reviews.length; i++) {
                avg += e.reviews[i].rating;
                //gets reviews:
                var reviewText, reviewUser, reviewStars;
                var reviewImage, reviewImageCertified;
                var reviewContainer;
                reviewContainer = $.UI.create('View',{
                    classes: ["reviewContainer"],
                });

                reviewImage = $.UI.create('ImageView',{
                    classes: ["reviewImage"]
                });

                reviewStars = $.UI.create('ImageView',{
                    classes: ["reviewStar"]
                });

                Alloy.Globals.Cloud.Photos.show({
                    photo_id: e.reviews[i].custom_fields.photo_id
                }, function (e) {
                    if (e.success) {
                        var photo = e.photos[0];
                        //Ti.API.info('Success:\n' + JSON.stringify(photo));
                        this.imageView.image = photo.urls.original;
                    } else {
                        //Ti.API.info('Error:\n' +
                        //    ((e.error && e.message) || JSON.stringify(e)));
                    }
                }.bind({imageView : reviewImage}));

                reviewContainer.add(reviewImage);
                reviewNameView = $.UI.create('View',{
                    layout: "horizontal"
                });

                reviewUser =  $.UI.create('Label',{
                    text: e.reviews[i].custom_fields.reviewer_name  + ' - ' + e.reviews[i].rating,
                    classes: ["reviewUser"],
                });
                reviewNameView.add(reviewUser);
                reviewNameView.add(reviewStars);
                reviewContainer.add(reviewNameView);

                reviewText =  $.UI.create('Label',{
                    text: e.reviews[i].content,
                    classes: ["reviewText"],
                });

                reviewContainer.add(reviewText);
                //reviewContainer.add(reviewStars);

                if(e.reviews[i].custom_fields.power_reviewer){
                  reviewImageCertified = $.UI.create('ImageView',{
                    classes: ["reviewImageCertified"]
                  });
                  reviewContainer.add(reviewImageCertified);
                  $.powerReviews.add(reviewContainer);
                }else{
                    reviewsViews.push(reviewContainer);
                }
            }
            $.reviews.views = reviewsViews;
            $.powerReviews.setHeight($.powerReviews.children == undefined ? 0 : $.powerReviews.children.length*64);
            setInterval(function() {
              $.reviews.moveNext();
            }, 5000);

            $.starwidget.setRating(avg/e.reviews.length);
        }else{
            $.starwidget.setRating(0);
        }
        $.reviewsActivityIndicator.setHeight(0);
        $.reviewsActivityIndicator.hide();
    } else {
        alert('Error:\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});

$.backMenuIconView.addEventListener("click", function(){
	$.profile.close();
});

