var express = require('express');

var app = express.createServer();

app.configure(function(){
  app.use(express.logger());
  app.use(express.static(__dirname + '/static'));
});

// NODE_ENV=development node app.js
app.configure('development',function(){
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

// NODE_ENV=production node app.js
app.configure('production',function(){
  app.use(express.errorHandler());
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('root');
});

var products = require('./products');

app.get('/products', function(req,res){
  res.render('products/index', { locals: {
    products: products.all
  }});
});

app.listen(4000);
