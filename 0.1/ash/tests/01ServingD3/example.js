var fs = require('fs');
var http = require('http');
http.createServer(function (req, res) {
  var filePath = '.' + req.url;
  if (filePath == './')
    filePath = './index.html';
  fs.readFile(filePath, function(error, content) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content, 'utf-8');
  });
}).listen(8000);
console.log('Server running at http://localhost:8000/');

