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

var scripts = require('./scripts');

app.get('/', function(req, res){
  scripts.all(function(err, allScripts){
    if(err) throw err;
    res.render('root', {locals: {
      scripts: allScripts
    }});
  });
});

app.get('/scripts/new', function(req, res){
  res.render('scripts/new');
});

app.post('/scripts', function(req, res){
  var name = req.body.script.name;
  scripts.insertNew(name, function(err, version){
    if(err) throw err;
    res.redirect('/scripts/'+name+'/'+version);
  });
});

app.get('/scripts/:name/versions', function(req, res) {
  scripts.findAllRevisions(req.params.name,function(err, revisions){
    if(err) throw err;
    res.render('scripts/versions', {locals: {
      name:req.params.name,
      revisions: revisions
    }});
  });
});

app.get('/scripts/:name/:version', function(req, res) {
  scripts.findRevision(req.params.name, req.params.version, function(err, revision){
    if(err) throw err;
    res.render('scripts/edit', {locals: {
      revision: revision
    }});
  });
});


app.put('/scripts/:name', function(req, res){
  var name = req.params.name;
  var content = req.body.revision.content;
  var message = req.body.revision.message;
  
  scripts.setContent(name, content, message ,function(err, version){
    if(err) throw err;
    res.redirect('/scripts/'+name+'/'+version);
  });
});

app.listen(4000);
