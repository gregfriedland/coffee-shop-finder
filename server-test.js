var chai = require('chai');
var expect = chai.expect;

var PORT = 8000;
var server = require('./server');
server.startServer(PORT, 'locations.csv');

var request = require('request');

describe('CoffeeShopServer', function() {
    it('Read endpoint', function() {
        request.get('http://127.0.0.1:' + PORT + '/coffeeshops/1', function (err, response, body) {
            expect(err).to.be.null;
            expect(body).to.equal('{"id":"1","name":"Equator Coffees & Teas","address":"986 Market St","latitude":37.782394430549445,"longitude":-122.40997343121123}');
        });
    });

    it('Create endpoint not GET', function(done) {
        request.get('http://127.0.0.1:' + PORT + '/coffeeshops', function (err, response, body) {
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    it('Create endpoint not PUT', function(done) {
        request.put('http://127.0.0.1:' + PORT + '/coffeeshops', function (err, response, body) {
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    it('Create endpoint with Read check', function(done) {
        request.post({uri: 'http://127.0.0.1:' + PORT + '/coffeeshops', 
            json: {name: 'testname', address: 'testaddress', latitude: 13, longitude: 17}},
            function (err, response, body) {
                expect(err).to.be.null;
                expect(JSON.stringify(body)).to.equal('{"id":"57"}');

                var id = body.id;
                request.get('http://127.0.0.1:' + PORT + '/coffeeshops/' + id, function (err, response, body) {
                    expect(err).to.be.null;
                    expect(body).to.equal('{"id":"57","name":"testname","address":"testaddress","latitude":13,"longitude":17}');
                    done();
                });
            });
    });

    it('Update endpoint with Read check', function(done) {
        request.put({uri: 'http://127.0.0.1:' + PORT + '/coffeeshops/1', 
            json: {name: 'testname2', address: 'testaddress2', latitude: 14, longitude: 18}},
            function (err, response, body) {
                expect(err).to.be.null;

                request.get('http://127.0.0.1:' + PORT + '/coffeeshops/1', function (err, response, body) {
                    expect(err).to.be.null;
                    expect(body).to.equal('{"id":"1","name":"testname2","address":"testaddress2","latitude":14,"longitude":18}');
                    done();
                });
            });
    });

    it('Delete endpoint with Read check', function(done) {
        request.delete('http://127.0.0.1:' + PORT + '/coffeeshops/1',
            function (err, response, body) {
                expect(err).to.be.null;

                request.get('http://127.0.0.1:' + PORT + '/coffeeshops/1', function (err, response, body) {
                    expect(response.statusCode).to.equal(404);
                    done();
                });
            });
    });

    it('FindNearest endpoint1', function(done) {
        request.get('http://127.0.0.1:' + PORT + '/coffeeshops/findnearest/535+Mission+St,+San+Francisco,+CA',
            function (err, response, body) {
                expect(err).to.be.null;
                expect(body).to.equal('{"id":"16","name":"Red Door Coffee","address":"111 Minna St","latitude":37.78746242830388,"longitude":-122.39933341741562}');
                done();
        });
    });

    it('FindNearest endpoint2', function(done) {
        request.get('http://127.0.0.1:' + PORT + '/coffeeshops/findnearest/252+Guerrero+St,+San+Francisco,+CA+94103,+USA',
            function (err, response, body) {
                expect(err).to.be.null;
                expect(body).to.equal('{"id":"28","name":"Four Barrel Coffee","address":"375 Valencia St","latitude":37.76702438676065,"longitude":-122.42195860692624}');
                done();
        });
    });
});
