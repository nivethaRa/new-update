// workaround to 'alloy is not defined'
var Alloy = require('alloy'),
    _ = require("alloy/underscore")._;
    
    

var q = function(name) {
	// config
	var qMod = require('Ti.Queue');
	var queue = null;
	var _self = this;
	var processing = false;
	var queueIndex = 0;
	var failures = 0;
	var _clearSelectedNodesArr;
	var cartId;
	var callback;

	this.init = function(name) {
		Alloy.Globals.loading.show(L("Please wait..."), false);
		queue = new qMod(name || 'main');
		queue.empty();
		queueIndex = 0;
		failures = 0;
	};

	this.add = function(opt, _cartId, _callback) {
		Ti.API.error('q:add');
		cartId = _cartId;
		callback = _callback;
		if (!queue)
			_self.init('main');
		queue.enqueue(opt);
	};

	this.start = function(job) {
		Ti.API.error('q:start');
		totalJobs = queue.getLength();
		!processing && this.waitForOnline();
	};

	this.waitForOnline = function() {
		Ti.API.error('q:waitForOnline');
		Titanium.Network.online ? this.next() : setTimeout(_.bind(this.waitForOnline, this), 1000);
	};

	this.next = function() {
		if (queue.getLength() == 0) {
			_self.finished();
			return;
		}
		processing = true;
		queueIndex++;

		var item = queue.dequeue();
		Ti.API.debug("Processing Item  :" + JSON.stringify(item));
		_self.processJob(item);
	};

	this.processJob = function(item) {
		Ti.API.error('	q:processJob ' + queueIndex + " out of " + totalJobs);
		Ti.API.error('q:nextItem');
		_self.addProductToCart(item);
		processing = false;
	};

	this.requeue = function(_productItem, _response) {
		Ti.API.info("***************requeue***************** " + JSON.stringify(_response));
		var options = Ti.UI.createAlertDialog({
			cancel : 0,
			buttonNames : ['Skip', 'Ok'],
			message : "Place order request failed\n" + " Reason: " + (_response.errors ? _response.errors : "Unexpected Error") + " \n Do you want to retry?",
			title : "Request Failed"

		});
		options.addEventListener('click', function(e) {
			if (e.index === 1) {
				_self.addProductToCart(_productItem);
			} else {
				failures++;
				_self.waitForOnline();
			}
		});
		options.show();
	};

	this.finished = function() {
		queue.destroy();
		processing = false;
		//Alloy.Globals.uploadingInProgress = false;
		Ti.API.error('@@@@@@@@@@@@ -- Finished Queue --@@@@@@@@@@@@');
		Ti.API.error('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
		callback();
	};

	this.addProductToCart = function(productItem) {

		Ti.API.info("*************addProductToCart*************** " + JSON.stringify(productItem));
		/*var modifierId = "1278241913421431153";*/
		var api = "https://api.molt.in/v1/carts/" + cartId;
		var params = {};
		params['quantity'] = productItem.quantity;
		var qty =  productItem.quantity;
		params['id'] = productItem.productId;
		/*productItem.isModifier ? params["modifier[" + modifierId + "]"] = "1314929092209935198" : false;*/
		if(productItem.selectedModifiers){
			/*params["modifier[" + modifierId + "]"] = "1314929092209935198";*/
			if(productItem.selectedModifiers.single) { 
				var singleData = productItem.selectedModifiers.single;
				for(i = 0; i<singleData.length; i++){
					Ti.API.info("singleData---->"+JSON.stringify(singleData[i]));
					 for (var key in singleData[i]) {
					 	params["modifier[" + key + "]"] = singleData[i][key];
   					 }

				}
			}
			if(productItem.selectedModifiers.multiple) { 
				var multipleData = productItem.selectedModifiers.multiple;
				for(i = 0; i<multipleData.length; i++){
					Ti.API.info("multipleData---->"+JSON.stringify(multipleData[i]));
					 for (var key in multipleData[i]) {
							params["modifier[" + key + "]["+multipleData[i][key]+"]"] = 1;
   					 }
				}
			}
			
		}
		params['currency'] = "BRL";
		
		Ti.API.info("**post Params** " + JSON.stringify(params));
		require('ServiceUtility').post(api, params, function(resp) {
			Ti.API.info('success response:: for add product to cart API' + JSON.stringify(resp));
			_self.next();
		}, function(resp) {
			Ti.API.info('error response:: for add product to cart API' + resp);
			_self.requeue(productItem, JSON.parse(resp));
		});
		return null;
	};
};

module.exports = q;
