var express = require('express');
var app = express();
var mongo = null;

//Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the DB
MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
	mongo = db;
	
  if(!err) {
    console.log("We are connected");
  }
});

app.get('/search', function(request, response) {
	var collection = mongo.collection('services');
	var query = request.query.query;
	
	if(request.query.query && request.query.query.length >= 2) {
		var regExp = new RegExp("^" + query + ".*", "gi");
		var suggestions = {
			query: query,
			items: []
		};
		
		collection.find({"name": regExp}, {_id: 0}).toArray(function(error, data) {
			for(var i in data) {
				suggestions.items.push(data[i]);
			}
			
			response.json(suggestions);
			response.end();
		});		
	} else {
		response.json({});
		response.end();
	}
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});