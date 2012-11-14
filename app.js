// from http://expressjs.com/guide.html
// static file serving from http://stackoverflow.com/questions/10434001/static-files-with-express-js
var express = require('express');
var _ = require('underscore');
var app = express();
var port = 80;
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
      var findProcess = spawn('find', ['.', '-maxdepth', '4']);

      var stringChunks = [];
      findProcess.stdout.on('data',function(data){
        stringChunks.push(data.toString());
      });
      findProcess.stderr.on('data',function(data){
        stringChunks.push(data.toString());
      });
      findProcess.on('exit',function(err){
        var text = stringChunks.join(''),
            lines = text.split('\n');
        callback([
          '<html>',
          '<body>',
          '<ul>',
          _.map(_.filter( lines, function(line){
            return line.substring(0, 3) != './.'
                   && line.length != 0
                   && line != '.';
          }), function(line){
            return [
              '<li>',
              '<a href="'+line.substring(2)+'">',
              line.substr(2),
              '</a>',
              '</li>'
            ].join('');
          }).join('\n'),
          '</ul>'
        ].join('\n'));
      });
    }
  };
})();

app.get('/directory', function(req, res){
  res.setHeader('Content-Type', 'text/html');
  var ext = req.params.fileExtension;
  directory.list(function(page){
    res.end(page);
  });
});
