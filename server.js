// Require Node Modules
var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Parse = require('parse/node'),
    ParseCloud = require('parse-cloud-express'),
    bodyParser = require('body-parser'),
	request = require('request');
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Import your cloud code (which configures the routes)
require('./cloud/main.js');
// Mount the webhooks app to a specific path (must match what is used in scripts/register-webhooks.js)
//app.use('/webhooks', ParseCloud.app);

app.get('/webhook/', function(req, res) {  
	if (req.query['hub.verify_token'] === '123456' ) {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong validation token');  
});

app.post('/webhook/', function(req, res) {  
	console.log("message received " + req.body);
	if(!req.body){
		console.log("no request body found");
		res.sendStatus(200);
		return;
	}

	messaging_events = req.body.entry[0].messaging;
	for (i = 0; i < messaging_events.length; i++) {
		event = req.body.entry[0].messaging[i];
		sender = event.sender.id;
		console.log("sender " + event.sender + ", message " + event.message.text);
		if (event.message && event.message.text) {
			text = event.message.text;
			// Handle a text message from this sender
			if(text == "help"){
				sendTextMessage(sender, "Please visit our website http://eventcam.in for all the information.");
			}else if(text.indexOf("event") == 0){
				var event = text.split(" ")[1];
				sendTextMessage(sender, "Please visit http://eventcam.in/" + event + " for event photos");
			}else if(text.indexOf("notify") == 0){
				sendTextMessage(sender, "This feature will be available soon.");
			}else{
				sendTextMessage(sender, "Please type 'help', 'event (eventname)', 'notify (eventname)' for more detail. For any other information please visit http://eventcam.in");
			}
		}
	}

	res.sendStatus(200);
});

var token = "EAAHbWFzW5fQBABr3kPZB1MpDgUGLZCZAZCX7e5WDZCfgDUT7RNYJV8gAfNHmcKloSuC2CZCPpxz5IGD6ZCRM1AC08gg1nnx0TwbTYoVr20IPnUUWJ2wJXqx1HmwgFxjGZB0T9jHLLaH7ex3wbrKY6w0OeAzluNFFInsk05ohbG34VgZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

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

