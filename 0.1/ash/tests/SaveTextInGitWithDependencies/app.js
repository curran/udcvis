var express = require('express'),
    scripts = require('./modules/scripts');;

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
  scripts.all(function(err, allScripts){
    if(err) throw err;
    res.render('root', {locals: {
      scripts: allScripts
    }});
  });
});

app.get('/about', function(req, res){
  res.render('about');
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
  var name = req.params.name, version = req.params.version;
  scripts.getContent(req.params, function(err, content){
    if(err) throw err;
    scripts.getDependencies(name, version, function(err, dependencies){
      if(err) throw err;
      res.render('scripts/edit', {locals: { revision: {
        name:name, 
        version: version, 
        content: content, 
        dependencies:dependencies,
      }}});
    });
  });
});

app.get('/scripts/:name/:version/run', function(req, res) {
  var name = req.params.name, version = req.params.version;
  
  scripts.findRevision(req.params, function(err, revision){
    console.log('revision found: '+revision.name+', template = '+revision.template.name);
    
    function getTemplatePieces(callback){
      if(revision.template)
        scripts.getContent(revision.template, function(err, content){
          var pieces = content.split('${code}');
          callback(true,pieces[0], pieces[1]);
        });
      else
        callback(false,null,null);
    }
    
    getTemplatePieces(function(hasTemplate, firstHalf, secondHalf){
      scripts.evaluateDependencies(name,version,function(dependencies){
        if(hasTemplate)
          res.write(firstHalf);
        res.write('// scripts included: ');
        for(var i in dependencies){
          var d = dependencies[i];
          res.write(' '+d.name+' v'+d.version);
        }
        res.write('\n');
        
        // TODO handle errors
        (function iterate(){
          if(dependencies.length === 0){
            if(hasTemplate)
              res.write(secondHalf);
            res.end();
          }
          else{
            var d = dependencies.splice(0,1)[0];
            scripts.getContent(d, function(err, content){
              if(err) throw err;
              var lines = content.split('\n');
              for(var i = 0; i < lines.length; i++){
                var line = lines[i];
                if(line.indexOf('@depends') === -1 &&
                   line.indexOf('@embed') === -1)
                  res.write(line + '\n');
              }
              iterate();
            });
          }
        })();
      });
    });
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
