var currentProfileID = arguments[0].user_id;
Alloy.Globals.applyLabelToTextField($.reviewText, "enterYourReview");

$.win.barColor = Alloy.Globals.navBarColor;
$.win.navTintColor = "white";


$.backMenuIconView.addEventListener("click", function() {
	$.review.close();
});

var responseElements = [];

var questionDisplayGen = function(questions) {

	for (var i = 0; i < questions.length; i++) {
		var q = questions[i];

		var questionContainer = $.UI.create('View', {
			classes : ["questionContainer"],
		});
		var questionLabel = $.UI.create('Label', {
			text : questions[i].text,
			classes : ["questionLabel"],
		});
		questionContainer.add(questionLabel);

		if (questions[i].isBoolean) {
			//yes or no question
			var switch1 = $.UI.create('Switch', {
				classes : ["questionSwitch"],
			});

			responseElements[i] = switch1;
			questionContainer.add(switch1);
		} else {
			//create a slider
			var slider1 = $.UI.create('Slider', {
				classes : ["questionSlider"],
			});

			var questionSliderLabel = $.UI.create('Label', {
				classes : ["questionSliderLabel"],
			});

			slider1.addEventListener('change', function(e) {
				this.label.text = parseInt(e.value);
			}.bind({
				label : questionSliderLabel
			}));

			responseElements[i] = slider1;
			questionContainer.add(slider1);
			questionContainer.add(questionSliderLabel);
		}

		$.questions.add(questionContainer);
	}
};

//FIXME: Query the questions
var questions = [];
q1 = {
	text : L('question1'),
	isBoolean : false,
};
q2 = {
	text : L('question2'),
	isBoolean : true,
};
q3 = {
	text : L('question3'),
	isBoolean : true,
};
q4 = {
	text : L('question4'),
	isBoolean : true,
};
q5 = {
	text : L('question5'),
	isBoolean : false,
};
questions.push(q1);
questions.push(q2);
questions.push(q3);
questions.push(q4);
questions.push(q5);

questionDisplayGen(questions);

$.submitReviewButton.addEventListener("click", function() {
	if ($.reviewText.value == "" || $.reviewText.value == L("enterYourReview")) {
		alert(L("reviewTextRequired"));
		return;
	}

	//Calculate the JUJO:
	var customFields = {
		'reviewer_name' : Alloy.Globals.currentUser.first_name + " " + Alloy.Globals.currentUser.last_name
	};
	var multiplier = 0;
	var average = 0;
	for (var i = 0; i < responseElements.length; i++) {
		customFields["question" + i] = {
			'text' : questions[i],
			'rate' : responseElements[i].value
		};
		if (responseElements[i].maxRange) {
			multiplier += 2;
			average += (responseElements[i].value * 2);
		} else {
			multiplier += 1;
			if (responseElements[i].value) {
				average += 5;
			}
		}
	}

	var jujo = average / multiplier;
	var review = $.reviewText.value;

	if (Alloy.Globals.currentUser.role == "powerreviewer") {
		customFields['power_reviewer'] = true;
	}
	customFields['photo_id'] = Alloy.Globals.currentUser.photo_id;

	//Send everything to DB and close
	Alloy.Globals.Cloud.Reviews.create({
		user_object_id : currentProfileID,
		rating : jujo,
		content : review,
		custom_fields : customFields,
	}, function(e) {
		if (e.success) {
			var review = e.reviews[0];
			alert('Success:\n' + 'rating: ' + review.rating + '\n' + 'content: ' + review.content);
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
	$.review.close();
});
