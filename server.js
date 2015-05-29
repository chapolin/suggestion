var express = require('express');
var app = express();
var mongo = null;
var port = process.env.PORT || 3000;

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
	  
	  response.send("OK");
});

app.get('/createDataEstab', function(request, response) {
	var collection = mongo.collection('places');
	
	  var lotsOfDocs = [
	                    {'name':'Caçula de Pneus'}, 
	                    {'name':'Jassa'}, 
	                    {'name':'Jacques Janine'}, 
	                    {'name':'Continental'}
	                    ];

	  collection.insert(lotsOfDocs, {w:1}, function(err, result) {});
	  
	  response.send("OK");
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
		
		console.log(serviceId);
		
		if(serviceId == 0) {
			var collection = mongo.collection('services');
			
			collection.findOne({name: serviceName}, function(err, doc) {
		        if (doc) {
		            console.log(doc);
		        } else {
		            console.log('Service data not found for name: ' + serviceName);
		            
		            var lotsOfDocs = [];
		            
		            var collection = mongo.collection('services');
		            
		            collection.insert({'name': serviceName}, {w:1}, function(err, result) {
		            	console.log(result.ok, result.ops);
		            	
		            });
		        }
		    });			
		}
		
		if(placeId == 0) {
			var collection = mongo.collection('places');
			
			collection.findOne({name: placeName}, function(err, doc) {
		        if (doc){
		            console.log(doc);
		        } else {
		            console.log('Establishment data not found for name: ' + serviceName);
		        }
		    });	
		}
		
		//var collection = mongo.collection('prices');
		
		var price = {
			value: value, 
			service: serviceId, 
			place: placeId
		};
		
		console.log(price);
		
//		if(price.value) {
//			collection.insert(price, {w:1}, function(err, result) {});
//		}
	}
	
	response.send("OK");
	
	// receber objeto post data
	// if id = 0 verificar se existe o nome, pegar o id.
	// montar o objeto price e salvar
	
//	if(value) {
//		var collection = mongo.collection('prices');
//		
//		var price = {
//			value: value, 
//			service: "507f1f77bcf86cd799439011", 
//			place: "507f1f77bcf86cd799439022"
//		};
//		
//		collection.insert(price, {w:1}, function(err, result) {});
//	}
//	
//	response.send("OK");
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

	console.log('Example app listening at http://%s:%s', host, port);
});
