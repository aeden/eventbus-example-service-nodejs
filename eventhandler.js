var dotenv = require('dotenv');
dotenv.load();

var http = require('http');
var sleep = require('sleep');
var WebSocket = require('ws');

var WEBSOCKET_URL = 'ws://localhost:3001/ws';

var ws = new WebSocket(WEBSOCKET_URL, {origin: 'http://localhost:3000'});

deliver = function(message) {
  console.log("Sending message: %s", message);

  var options = {
    hostname: 'localhost',
    port: 3001,
    method: 'POST'
  };
  var req = http.request(options, function(res) {
    if (res.statusCode == 200) {
      console.log("Successfully created event");
    } else {
      console.log(res);
    }
  });

  req.on('error', function(e) {
    console.log("Error sending message: %s", e);
  });

  req.setHeader('Content-Type', 'application/json');
  req.setHeader('Authorization', process.env.AUTHORIZATION_TOKEN);
  req.write(message);
  req.end();
};

ws.on('open', function() {
  console.log("Connected");
  retry_count = 0;
  ws.send(JSON.stringify({action: 'authenticate', credentials: process.env.AUTHORIZATION_TOKEN}));
});

ws.on('message', function(msg, flags) {
  console.log('Received message: %s', msg);
  var evt = JSON.parse(msg);

  switch (evt['name']) {
    case 'check-domain':
      sleep.sleep(1);

      var results = [];
      for (var i = 0, len = evt['data'].length; i < len; i++) {
        results.push({name: evt['data'][i], availability: 'available'});
      }

      message = {name: 'check-domain-completed', data: results, context: evt['context']};
      deliver(JSON.stringify(message));
      break;
    case 'register-domain':
      received_data = evt['data'];

      sleep.sleep(2);

      results = {
        name: received_data['name'],
        registered: true,
        expiration: ''
      };

      message = JSON.stringify({name: 'register-domain-completed', data: results, context: evt['context']});
      deliver(message);
      break;
  }
});

ws.on('close', function() {
  console.log("Disconnected");
});
