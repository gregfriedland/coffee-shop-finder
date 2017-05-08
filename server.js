var express = require('express');
var bodyParser = require('body-parser');
var coffeeShops = require('./coffeeShops');
var request = require('request');

var app = express();
app.use(bodyParser.json());

var shopData = null;
var API_KEY = 'AIzaSyB3PI0mhEzxeMiK84ktSBiuB4g-QW7gzS8';

// Create endpoint
app.post('/coffeeshops', function (req, res) {
    console.log("POST request for new shop:", req.body);
    if (typeof req.body.name == 'undefined' ||
        typeof req.body.address == 'undefined' || typeof req.body.latitude == 'undefined' ||
        typeof req.body.longitude == 'undefined') {
        res.status(400).send('{"error": "Cannot update coffee shop entry with missing fields."}');
    } else {
        var maxId = 0;
        for (var id in shopData) {
            maxId = Math.max(maxId, Number(id));
        }
        var id = (maxId + 1).toString();
        console.log("Creating coffee shop entry with id", id);
        shopData[id] = new coffeeShops.CoffeeShop(id, req.body.name, req.body.address,
            Number(req.body.latitude), Number(req.body.longitude));
        res.send('{"id": "' + id + '"}');
    }
});

// Read endpoint
app.get('/coffeeshops/:shopid', function (req, res) {
    var id = req.params.shopid;
    console.log("GET request for shop with id: '" + id + "'");
    if (id in shopData) {
        res.send(shopData[id].toJSON());
    } else {
        res.status(404).send('{"error": "Coffee shop with that id not found."}')
    }
});

// Update endpoint
app.put('/coffeeshops/:shopid', function (req, res) {
    var id = req.params.shopid;
    console.log("PUT request for shop with id: '" + id + "':", req.body);
    if (typeof req.body.name == 'undefined' ||
        typeof req.body.address == 'undefined' || typeof req.body.latitude == 'undefined' ||
        typeof req.body.longitude == 'undefined') {
        res.status(400).send('{"error": "Cannot update coffee shop entry with missing fields."}');
    } else if (!(id in shopData)) {        
        res.status(404).send('{"error": "Cannot update coffee shop entry with nonexistent id."}');
    } else {
        shopData[id] = new coffeeShops.CoffeeShop(id, req.body.name, req.body.address,
            Number(req.body.latitude), Number(req.body.longitude));
        res.send();
    }
});

// Delete endpoint
app.delete('/coffeeshops/:shopid', function (req, res) {
    var id = req.params.shopid;
    if (id in shopData) {
        console.log("DELETE request for shop with id: '" + id + "'");
        delete shopData[id];
        res.send();        
    } else {
        res.status(404).send('{"error": "Coffee shop with that id not found."}');
    }
});

// FindNearest endpoint
app.get('/coffeeshops/findnearest/:address', function (req, res) {
    var address = req.params.address;
    console.log("GET request for findnearest with address: '" + address + "'");
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + 
        encodeURIComponent(address) + '&key=' + API_KEY;
    request(url, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(500).send('{"error": "Unable to geocode requested address: ' + address + '."}')
        } else if (shopData.length == 0) {
            res.status(500).send('{"error": "No coffee shops in DB."}')
        } else {
            try {
                body = JSON.parse(body);
                var latitude = body.results[0].geometry.location.lat;
                var longitude = body.results[0].geometry.location.lng;
                console.log("  Geocoded address to lat=", latitude, " long=", longitude);
                var id = coffeeShops.findNearest(shopData, latitude, longitude);
                res.send(shopData[id].toJSON());
            } catch (exc) {
                res.status(500).send('{"error": "Unable to parse Google response to geocode requested address: ' + address + '."}')
            }
        }
    });
});


// load the data into memory then start the server
var startServer = function(port, csvFilename) {
    coffeeShops.loadFromCSV(csvFilename, (err, data) => {
        if (err) {
            console.error('Error loading data from csv: ', err);
            process.exit(1);
        }
        shopData = data;

        app.listen(port, function () {
            console.log('Listening on', port);
        });
    });    
};

module.exports.startServer = startServer;
