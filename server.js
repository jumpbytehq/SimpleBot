// Require Node Modules
var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Parse = require('parse/node'),
    ParseCloud = require('parse-cloud-express');

var app = express();

// Import your cloud code (which configures the routes)
require('./cloud/main.js');
// Mount the webhooks app to a specific path (must match what is used in scripts/register-webhooks.js)
//app.use('/webhooks', ParseCloud.app);

app.post('/webhook/', function(req, res) {  
	// if (req.query['hub.verify_token'] === '123456' ) {
	// 	res.send(req.query['hub.challenge']);
	// }
	// res.send('Error, wrong validation token');  

	messaging_events = req.body.entry[0].messaging;
	for (i = 0; i < messaging_events.length; i++) {
		event = req.body.entry[0].messaging[i];
		sender = event.sender.id;
		if (event.message && event.message.text) {
			text = event.message.text;
			// Handle a text message from this sender
		}
	}

	res.sendStatus(200);
});

// Host static files from public/
app.use(express.static(__dirname + '/public'));

// Catch all unknown routes.
app.all('/', function(request, response) {
  response.status(404).send('Page not found.');
});
/*
 * Launch the HTTP server
 */
var port = process.env.PORT || 5000;
var server = http.createServer(app);
server.listen(port, function() {
  console.log('Cloud Code Webhooks server running on port ' + port + '.');
});

