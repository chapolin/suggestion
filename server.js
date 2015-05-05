var express = require('express');
var app = express();
var mongo = null;
var port = process.env.PORT || 8080;

//Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the DB
MongoClient.connect(
		"mongodb://suggestion:susuggestion@ds031922.mongolab.com:31922/heroku_app36543480", 
		function(err, db) {
	mongo = db;
  if(!err) {
    console.log("We are connected");
  }
});

app.get('/createData', function(request, response) {
	var collection = mongo.collection('services');
	
	  var lotsOfDocs = [
	                    {'name':'Alinhamento'}, 
	                    {'name':'Cambagem'}, 
	                    {'name':'Escova'}, 
	                    {'name':'Progressiva'}, 
	                    {'name':'Buffets'}, 
	                    {'name':'Insulfim'}, 
	                    {'name':'Balanciamento'}, 
	                    {'name':'Aquecedores'} ,
	                    {'name':'Caster'}
	                    ];

	  collection.insert(lotsOfDocs, {w:1}, function(err, result) {});
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

var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
