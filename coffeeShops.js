var fs = require('fs');

var CoffeeShop = function(id, name, address, latitude, longitude) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.latitude = Number(latitude);
    this.longitude = Number(longitude);
};

CoffeeShop.prototype.toJSON = function() {
    return JSON.stringify({
        id: this.id,
        name: this.name,
        address: this.address,
        latitude: this.latitude,
        longitude: this.longitude
    });
};

CoffeeShop.prototype.distanceSquared = function(latitude, longitude) {
    return Math.pow(this.latitude - latitude, 2) + Math.pow(this.longitude - longitude, 2);
}


var loadFromCSV = function(filename, callback) {
    fs.readFile(filename, {'encoding': 'utf8'}, (err, input) => {
        if (err) {
            callback("Error reading input file '" + filename + "': " + err);
            return;
        }
        var data = {};
        var lines = input.split("\n");
        for (var i = 0; i < lines.length; ++i) {
            var fields = lines[i].split(", ");
            if (fields.length != 5) {
                callback("Error parsing input file '" + filename + 
                    "': invalid number of fields:", fields.length);
                return;
            }
            data[fields[0]] = new CoffeeShop(fields[0], fields[1], fields[2], fields[3], fields[4]);
        }
        // console.log(JSON.stringify(data, null, 2));
        callback(err, data);
    });
};


// This is a naive approach which takes O(n). A faster approach would be to use 
// a spatial index such as a quad tree which would take O(log(n))
var findNearest = function(coffeeShops, latitude, longitude) {
    var closestShopId = null;
    var closestDistSq = Infinity;
    for (var id in coffeeShops) {
        var distSq = coffeeShops[id].distanceSquared(latitude, longitude);
        if (distSq < closestDistSq) {
            closestShopId = id;
            closestDistSq = distSq;
        }
    }

    return closestShopId;
}

module.exports.loadFromCSV = loadFromCSV;
module.exports.findNearest = findNearest;
module.exports.CoffeeShop = CoffeeShop;
