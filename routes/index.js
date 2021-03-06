
var moment = require("moment"); // date manipulation library
var richterModel = require("../models/richter.js"); //db model
var request = require('request');
var cheerio = require('cheerio');


exports.index = function(req, res) {
	
	console.log("main page requested");

	var templateData = {
		pageTitle : "Welcome to the Gerhard Richter Scraper!"

}

	res.render('index.html', templateData);
}

exports.page2 = function(req, res) {
	
	console.log("second page requested");
	// anything I want to put into that object, its in templateData!
	richterModel.find( {}, 'photoURL', function(err, response) {

		if (response.length > 0) {
			//console.log("found richterModels")
			//console.log(response)
			
			var templateData = {
				pageTitle : "Gerhard's Abstract Paintings",
				photographs : response
			}
			res.render('detail.html', templateData);
		} else {
			
		}

});	
}

exports.page3 = function(req, res) {
	
	
	console.log("second page requested");
	// anything I want to put into that object, its in templateData!
	richterModel.find( {}, 'photoURL', function(err, response) {

		if (response.length > 0) {
			//console.log("found richterModels")
			//console.log(response)
			
			var templateData = {
				pageTitle : "Gerhard's Color Charts",
				photographs : response
			}
			res.render('detail.html', templateData);
		} else {
	}

});	
}

exports.loadData = function(req, res) {	 
	
// not elegant, but this is getPhotos for colorCharts
	getPhotos('colorCharts', function (photos) {
		
		for(p in photos) {
			currPhoto = photos[p];
			//console.log("currPhoto" + ":" + currPhoto.photoURL)
			// {index:
			//  photoUrl: }

			//prepate URL's for database
			tmpPhoto = new richterModel();
			tmpPhoto.photoURL = currPhoto.photoURL;
			tmpPhoto.save(function(err){
				// if an error occurred on save.
				if (err) {
					console.error("error on save");
					console.error(err);
				} else {
					console.log("color charts loaded/saved in database");
				}
			});
		}
		return res.send("loaded photos!");
	});

// ...and this runs getPhotos for the abstracts
	getPhotos('1995-1999', function (photos) {
		
		for(p in photos) {
			currPhoto = photos[p];

			//prepate URL's for database
			tmpPhoto = new richterModel();
			tmpPhoto.photoURL = currPhoto.photoURL;
			tmpPhoto.save(function(err){
				// if an error occurred on save.
				if (err) {
					console.error("error on save");
					console.error(err);
				} else {
					console.log("abstracts loaded/saved in database");
				}
			});
		}
		return res.send("loaded photos!");
	});
} 

// THE SCRAPER ITSELF!!!

var categories = {
	'colorCharts':12,
	'1995-1999': 58
}

var getPhotos = function(category, callback) {
	// abstract url
	var url = 'http://www.gerhard-richter.com/art/paintings/abstracts/category.php?p=1&sp=all&catID='+categories[category]

	var imageAppendURL = 'http://www.gerhard-richter.com/'

	var tempPhotos = [];
	var photos = [];

	// request is slowing down this function, so we put the callback at the end of the slow part
	request(url, function(err, resp, body){
	 
	  $ = cheerio.load(body);
	  links = $('.art.category div img'); //use your CSS selector here
	  $(links).each(function(i, link){
	    tempPhotos[i] = imageAppendURL + $(link).attr('src'); 
	    
	    //the conditional below sorts out those pesky "non image available" JPEGs
	    if (tempPhotos[i] != imageAppendURL + "/images/size_o__thumb_1__imageid_.jpg") {
	    // as long as the photos are real photos of richter paintings, push them to the photos array
	    photos.push({
	    	index: i,
	    	photoURL : tempPhotos[i]
	    	})
	    	};
	    });
	  // now, return photos as a parameter to the callback.
	  callback(photos);
	});
}

exports.data_all = function(req, res) {
	var photoQuery = richterModel.find({});
	photoQuery.exec(function(err, response) {


var jsonData = {
	status : "OK",
	photoResult : response

}
res.json(jsonData)
});

}






