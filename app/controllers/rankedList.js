$.backRankedListViewIcon.addEventListener("click", function() {
	$.rankedList.close();
});

var loadRankedList = function(order) {
	$.menuActivityIndicator.show();
	Alloy.Globals.Cloud.Users.query({
		page : 1,
		per_page : 10,
		order : order,
		where : {
			role : "foodtruck"
		}
	}, function(e) {
		if (e.success) {
			var tableData = [];
			//CREATE TABLE ROW
			for (var i = 0; i < e.users.length; i++) {
				var row = Ti.UI.createTableViewRow({
					className : 'forumEvent', // used to improve table performance
					rowIndex : i, // custom property, useful for determining the row during events
					layout : "vertical"
					//height: 50
				});

				var rowContent = $.UI.create('View', {
					classes : ["absoluteTableRow"],
				});

				var imageFT = $.UI.create('ImageView', {
					classes : ["imageFT"],
				});

				Alloy.Globals.Cloud.Photos.show({
					photo_id : e.users[i].photo_id
				}, function(e) {
					if (e.success) {
						var photo = e.photos[0];
						//Ti.API.info('Success:\n' + JSON.stringify(photo));
						this.imageView.image = photo.urls.original;
					} else {
						//Ti.API.info('Error:\n' +
						//    ((e.error && e.message) || JSON.stringify(e)));
					}
				}.bind({
					imageView : imageFT
				}));

				rowContent.add(imageFT);

				var rating = e.users[i].ratings_average;
				if (rating == undefined) {
					rating = 0;
				}

				var percentage = e.users[i].custom_fields.return_percentage;
				if (percentage == undefined) {
					percentage = 0;
				}

				var labelUserName = $.UI.create('Label', {
					classes : ["labelUserName"],
					text : e.users[i].custom_fields.foodtruck_name,
				});
				rowContent.add(labelUserName);

				var rowDetailsContent = $.UI.create('View', {
					classes : ["detailsTableRow"],
				});
				var labelDetails = $.UI.create('Label', {
					classes : ["labelDetails"],
					text : e.users[i].custom_fields.description,
				});
				rowDetailsContent.add(labelDetails);

				var labelHours = $.UI.create('Label', {
					classes : ["labelDetails"],
					text : L('typicalHours') + ": " + e.users[i].custom_fields.typical_hours + "   " + rating + "/5\u2605   " + percentage + "%",
				});
				rowDetailsContent.add(labelHours);

				rowContent.add(rowDetailsContent);

				row.add(rowContent);

				tableData.push(row);
			}
			$.rankedListTable.data = tableData;
		}
	});
	$.menuActivityIndicator.hide();
};

loadRankedList("-ratings_average");

$.reviewIconView.addEventListener("click", function() {
	loadRankedList("-ratings_count");
});

$.jujoIconView.addEventListener("click", function() {
	loadRankedList("-ratings_average");
});

$.returnIconView.addEventListener("click", function() {
	loadRankedList("-return_percentage");
}); 