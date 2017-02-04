$.backMenuIconView.addEventListener("click", function(){
	$.requestJujo.close();
});


var qrURL = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&bgcolor=555&data=100";          // + Alloy.Globals.currentUser.id;
var f = Ti.Filesystem.getFile(Alloy.Globals.userQrImage);

if(f.exists()) {
	Ti.API.info("file exists " + Alloy.Globals.userQrImage);
	$.qrCode.image = Alloy.Globals.userQrImage;
} else {
	//Ti.API.info(qrURL);
	$.qrCode.image = qrURL;
	var xhr = Titanium.Network.createHTTPClient({
		onload: function() {
			var xhr2 = Titanium.Network.createHTTPClient({
				onload: function() {
					Ti.API.info("*************request jujo************** "+JSON.stringify(this.responseData));
					f.write(this.responseData);
				}
			});
			xhr2.open('GET',this.location);
			xhr2.send();
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
		}
	});
	xhr.open('GET',qrURL);
	xhr.send();
}
