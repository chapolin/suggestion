var express = require('express');
var app = express();
var mongo = null;
var port = process.env.PORT || 3000;
var Step = require('step');

app.use(express.bodyParser());
app.set('view engine', 'ejs');

//Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the DB
MongoClient.connect(
		"mongodb://suggestion:susuggestion@ds031922.mongolab.com:31922/heroku_app36543480", 
		function(err, db) {
	mongo = db;
  if(!err) {
    console.log("We are connected in mongodb :)");
  }
});

app.get('/shortcut', function(req, res) {
    // EJS render automatically looks in the views folder
    res.render('shortcut');
});

app.get('/services', function(request, response) {
	var collection = mongo.collection('services');
	var query = request.query.query;
	
	if(query && (query.length >= 2 || query == "all")) {
		if(query == "all") {
			query = "";
		}
		
		var regExp = new RegExp("^" + query + ".*", "gi");
		var suggestions = [];
		
		collection.find({"name": regExp}, {}).toArray(function(error, data) {
//			for(var i in data) {
//				suggestions.push(data[i].name);
//			}
			
			response.json(data);
			response.end();
		});		
	} else {
		response.json([]);
		response.end();
	}
});

app.get('/establishment', function(request, response) {
	var collection = mongo.collection('places');
	var query = request.query.query;
	
	if(query && (query.length >= 2 || query == "all")) {
		if(query == "all") {
			query = "";
		}
		
		var regExp = new RegExp("^" + query + ".*", "gi");
		var suggestions = [];
		
		collection.find({"name": regExp}).toArray(function(error, data) {
//			for(var i in data) {
//				suggestions.push(data[i].name);
//			}
			
			response.json(data);
			response.end();
		});		
	} else {
		response.json([]);
		response.end();
	}
});

app.post('/services', function(request, response) {
	if(request.body.hasOwnProperty("value") || 
			request.body.hasOwnProperty("service") || 
			request.body.hasOwnProperty("establishment")) {
		var serviceId = request.body.hasOwnProperty("service") ? request.body.service.id : null;
		var serviceName = request.body.hasOwnProperty("service") ? request.body.service.name : null;
		var placeId = request.body.hasOwnProperty("establishment") ? request.body.establishment.id : null;
		var placeName = request.body.hasOwnProperty("establishment") ? request.body.establishment.name : null;
		var value = request.body.hasOwnProperty("value") ? request.body.value : null;
		
		Step(
			function() {
				var callback = this;
				
				if(serviceId == 0) {
					var collection = mongo.collection('services');
					
					collection.findOne({"name": { $regex: new RegExp(serviceName.trim(), "i")}}, function(err, doc) {
				        if (doc) {
				            console.log("Service from doc:", doc);
				            
				            callback(null, {
			            		id: doc._id,
			            		name: doc.name
			            	});
				        } else {
				            console.log('Service data not found for name: ' + serviceName);
				            
				            var collection = mongo.collection('services');
				            
				            collection.insert({'name': serviceName}, {w:1}, function(err, result) {
				            	console.log("Service from insert:", result.ops[0]);
				            	
				            	callback(null, {
				            		id: result.ops[0]._id,
				            		name: result.ops[0].name
				            	});
				            });
				        }
				    });			
				} else if(serviceId != null) {
					callback(null, {id: serviceId, name: serviceName});
				} else {
					callback(null, null);
				}
			}, function(error, service) {
				var price = {
					service: service != null ? service.id : null
				};
				var callback = this;
				
				if(placeId == 0) {
					var collection = mongo.collection('places');
					
					collection.findOne({"name": { $regex: new RegExp(placeName.trim(), "i")}}, function(err, doc) {
				        if (doc){
				        	console.log("Establishment from doc:", doc);
				        	
				        	price.place = doc._id;
				        	
				        	callback(null, price);
				        } else {
				        	console.log('Establishment data not found for name: ' + placeName);
				            
				            var collection = mongo.collection('places');
				            
				            collection.insert({'name': placeName}, {w:1}, function(err, result) {
				            	console.log("Establishment from insert:", result.ops[0]);
				            	
				            	price.place = result.ops[0]._id;
				            	
				            	callback(null, price);
				            });
				        }
				    });	
				} else if(placeId != null) {
					price.place = placeId;
					
					callback(null, price);
				} else {
					callback(null, price);
				}
			}, function(error, price) {
				if(value) {
					price.value = value;
					
					console.log("With value", value, price);
					
					var collection = mongo.collection('prices');
					
					collection.insert(price, {w:1}, function(err, result) {});
					
					console.log("Insert successfully");
				}
				
				response.send("OK");
			}
		);
	}
});

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {
    // EJS render automatically looks in the views folder
    res.render('index');
});

//set the home page route
app.get('/device', function(req, res) {
    res.render('device');
});

var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Server started. Listening at http://%s:%s', host, port);
});
