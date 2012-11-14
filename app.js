// from http://expressjs.com/guide.html
// static file serving from http://stackoverflow.com/questions/10434001/static-files-with-express-js
var express = require('express');
var _ = require('underscore');
var app = express();
var port = 8080;
app.use(express.static(__dirname));
app.use(express.directory(__dirname));
app.listen(port);
console.log('Listening on port '+port);


// Enable Cross Origin Resource Sharing (CORS)
// Code snippet from [Enable-Cors.org](http://enable-cors.org/#how-expressJS)
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var directory = (function(){
  var spawn = require('child_process').spawn;
  return {
    list: function(callback){
      var findProcess = spawn('find', ['.']);
      var stringChunks = [];
      findProcess.stdout.on('data',function(data){
        stringChunks.push(data.toString());
      });
      findProcess.on('exit',function(err){
        var text = stringChunks.join(''),
            lines = text.split('\n');
        callback([
          '<html>',
          '<body>',
          '<ul>',
          _.map(lines, function(line){
            return [
              '<li>',
              line,
              '</li>'
            ].join('');
          }).join(''),
          '</ul>'
        ].join(''));
      });
    }
  };
})();

app.get('/directory', function(req, res){
  res.setHeader('Content-Type', 'text/html');
  directory.list(function(page){
    res.end(page);
  });
});
