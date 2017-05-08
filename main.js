var PORT = 8080;
var server = require('./server');

// parse arguments
if (process.argv.length != 3) {
    console.error('Usage:', process.argv[0], process.argv[1], '<input-csv>');
    process.exit(1);
}
server.startServer(PORT, process.argv[2]);
