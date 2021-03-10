const http = require('http'); //imports the HTTP module
    fs = require('fs'),
    url = require('url');

http.createServer((request, response) => { //the two arguments of the function passed to createServer()
    let addr = request.url,
        q = url.parse(addr, true),
        filePath = '';

  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {//For all requests, use fs module to log request URL + timestamp
    if (err) {
      console.log(err);
    } else {
      console.log('added to log'); 
    }
  });

  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();

  });

}).listen(8080);
console.log('My test server is running on Port 8080.');