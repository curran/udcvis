var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs');

app.listen(8080);

function handler (req, res) {
  //TODO use one of the static file serving packages,
  //this code doesn't use the right MIME types
  var filePath = '.' + req.url;
  if (filePath == './')
    filePath = './index.html';
  fs.readFile(filePath, function(error, content) {
    res.writeHead(200);
    res.end(content, 'utf-8');
  });
}
