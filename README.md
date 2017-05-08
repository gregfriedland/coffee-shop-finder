#### Coffee Shop Finder REST server

##### Installation and setup
1. `git clone https://github.com/gregfriedland/coffee-shop-finder.git`
2. `cd coffee-shop-finder`
3. `npm install`
4. Start REST server: `node ./main.js locations.csv`
5. Run unit tests: `mocha server-test.js`

##### Create endpoint
* Path: `/coffeeshops`
* Method: `POST`
* Body: `{"name": <shop-name>, "address": <shop-address>, "latitude": <shop-latitude>, "longitude": <shop-longitude>}`
* Response: `{"id": <new-shop-id>}`
* Example: `curl 127.0.0.1:8080/coffeeshops -X POST -d '{"name":"testname", "address":"testaddress", "latitude":1, "longitude":2}' -H "Content-Type: application/json"`

##### Read endpoint
* Path: `/coffeeshops/:shopid`
* Method: `GET`
* Body: `N/A`
* Response: `{"id": <shop-id>, "name": <shop-name>, "address": <shop-address>, "latitude": <shop-latitude>, "longitude": <shop-longitude>}`
* Example: `curl 127.0.0.1:8080/coffeeshops/1 -X GET`

##### Update endpoint
* Path: `/coffeeshops/:shopid`
* Method: `PUT`
* Body: `{"name": <shop-name>, "address": <shop-address>, "latitude": <shop-latitude>, "longitude": <shop-longitude>}`
* Response: `N/A`
* Example: `curl 127.0.0.1:8080/coffeeshops/1 -X PUT -d '{"name":"testname", "address":"testaddress", "latitude":1, "longitude":2}' -H "Content-Type: application/json"`

##### Delete endpoint
* Path: `/coffeeshops/:shopid`
* Method: `DELETE`
* Body: `N/A`
* Response: `N/A`
* Example: `curl 127.0.0.1:8080/coffeeshops/1 -X DELETE`

##### FindNearest endpoint
* Path: `/coffeeshops/findnearest/:address`
* Method: `GET`
* Body: `N/A`
* Response: `{"id": <shop-id>, "name": <shop-name>, "address": <shop-address>, "latitude": <shop-latitude>, "longitude": <shop-longitude>}`
* Example: `curl 127.0.0.1:8080/coffeeshops/findnearest/535+Mission+St,+San+Francisco,+CA -X GET`
