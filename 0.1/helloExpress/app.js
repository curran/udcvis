// from http://expressjs.com/guide.html
// static file serving from http://stackoverflow.com/questions/10434001/static-files-with-express-js
var express = require('express');
var app = express();
var port = 8080;
app.get('/hello', function(req, res){
  res.send('Hello World');
});
app.use(express.static(__dirname + '/public'));
app.listen(port);
console.log('Listening on port '+port);
