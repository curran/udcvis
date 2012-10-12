// from http://expressjs.com/guide.html
// static file serving from http://stackoverflow.com/questions/10434001/static-files-with-express-js
var express = require('express');
var app = express();
var port = 80;
app.use(express.static(__dirname));
app.listen(port);
console.log('Listening on port '+port);
