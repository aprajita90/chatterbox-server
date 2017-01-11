/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var url = require('url');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


var results = [];

exports.requestHandler = function(request, response) {
  
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  //DEFINE VARIABLES
  var responseMessage = '';
  var statusCode;
  var method = request.method;
  var url = request.url;
  var headers = defaultCorsHeaders;
  if (headers) {
    headers['Content-Type'] = 'application/JSON';
  }

  //Response Body for GET and POST
  var responseBody = {
    headers: headers,
    method: method,
    url: url,
    results: results
  };

  //STATUS CODE
  if (url !== '/classes/messages' && url !== '/classes/messages?order=-createdAt' && request.method !== 'OPTIONS') {
    statusCode = 404; //Wrong URL ['Not Found']
  } else if (request.method === 'GET' || request.method === 'OPTIONS') {
    statusCode = 200; // GET
  } else if (request.method === 'POST') {
    console.log('inside POST status code');
    statusCode = 201; //POST
  } else {
    statusCode = 501;
    response.writeHead(statusCode, headers);
    response.end(responseMessage);
  }

  //processing request
  if (request.method === 'GET') {
    responseMessage = JSON.stringify(responseBody);
    response.writeHead(statusCode, headers);
    response.end(responseMessage);
  }

  if (request.method === 'POST') {
    var obj = '';
    request.on('data', function(chunk) {
      obj += chunk.toString();
    });

    request.on('end', function() {
      var parseObj = JSON.parse(obj);
      parseObj.objectId = Math.random() * 10000;
      results.push(parseObj);

      //if message says I Am Tea Pot
      if (parseObj.message === 'I Am Tea Pot') {
        console.log('here');
        statusCode = 418;
        console.log('statusCode', statusCode);
        response.writeHead(statusCode, headers);
        response.end(responseMessage);
      } else {
        response.writeHead(statusCode, headers);
        response.end(responseMessage);
      }
    });
  }
  // response.writeHead(statusCode, headers);
  // response.end(responseMessage);
};


