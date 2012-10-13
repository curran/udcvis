var express = require('express');

var app = express.createServer();

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
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
  app.use(express.logger());
  app.use(express.errorHandler());
});

app.set('view engine','jade');
app.set('views',__dirname + '/views');

app.get('/', function(req, res){
  res.render('root');
});

var products = require('./products');

app.get('/products', function(req, res){
  res.render('products/index', {locals: {
    products: products.all
  }});
});

app.get('/products/new', function(req, res){
  res.render('products/new', {locals: {
    product: products.new()
  }});
});

app.post('/products', function(req, res){
  var id = products.insert(req.body.product);
  res.redirect('/products/' + id);
});

app.get('/products/:id', function(req, res) {
  var product = products.find(req.params.id);
  res.render('products/show', {locals: {
    product: product
  }});
});

app.get('/products/:id/edit', function(req, res){
  var product = products.find(req.params.id);
  res.render('products/edit', {locals: {
    product: product
  }});
});

app.put('/products/:id', function(req, res){
  console.log('here');
  var id = req.params.id;
  products.set(id, req.body.product);
  res.redirect('/products/'+id);
});

app.listen(4000);
