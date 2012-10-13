
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var Revisions = new Schema({
  name: String,
  version: Number,
  message: {type: String, default:''},
  content: {type: String, default:''}
});

var Scripts = new Schema({
  name: String,
  latestVersion: Number
});

mongoose.connect('mongodb://localhost/mydatabase');
mongoose.model('Script',Scripts);
mongoose.model('Revision',Revisions);


var Script = mongoose.model('Script');
var Revision = mongoose.model('Revision');


//clear and repopulate the DB for testing
Revision.remove({},function(){
  Script.remove({},function(){
    console.log("db cleared");
    
    var revisions =
    [{
      name: 'a',
      version: 0.01,
      content: 'script A'
      /*dependencies: []*/
    },
    {
      name: 'b',
      version: 0.01,
      content: 'script B'
      /*dependencies: [
        {name:'a',version:0.1}
      ]*/
    },
    {
      name: 'a',
      version: 0.02,
      content: 'script A better'
      /*dependencies: []*/
    },
    {
      name: 'c',
      version: 0.01,
      content: 'script C'
      /*dependencies: [
        {name:'b',version:0.1},
        {name:'a',version:0.2}
      ]*/
    }];
    
    
    
    var updateScript = function(revision, callback){
      Script.findOne({name: revision.name},function(err,script){
        if(err) throw err;
        if(!script){
          script = new Script();
          script.name = revision.name;
          script.latestVersion = revision.version;
          script.save(function(err){
            if(err) throw err;
            console.log('created script '+script.name+script.latestVersion);
            callback();
          });
        }
        else if(revision.version > script.latestVersion){
          script.latestVersion = revision.version;
          script.save(function(err){
            if(err) throw err;
            console.log('updated script '+script.name+script.latestVersion);
            callback();
          });
        }
        else
          callback();
      });
    };
    
    var insertRevision = function(revision, callback){
      updateScript(revision, function(){
        var revisionInDB = new Revision();
        revisionInDB.name = revision.name;
        revisionInDB.version = revision.version;
        revisionInDB.content = revision.content;
        
        revisionInDB.save(function(err){
          if(err) callback(err);
          console.log('saved revision '+revision.name+revision.version);
          callback(null);
        });
      });
    };

    var insertAll = function(coll, callback){
      var queue = coll.splice(0);//make a copy
      var elem;
      (function iterate(){
        if(queue.length === 0)
          callback();
        else{
          revision = queue.splice(0,1)[0];
          insertRevision(revision,function(err){
            if(err){throw err;}
            setTimeout(iterate,0);// to break from the stack
          });
        }
      })();
    };
    
    insertAll(revisions,function(){
      console.log('all revisions saved');
    });
  });
});

module.exports.all = function(callback){
  Script.find({},callback);
};

// finds the script with the given name.
// callback(error, script)
module.exports.findRevision = function(name, version, callback){
  Revision.findOne({name:name, version: version},callback);
};

// inserts a new script with the given name and blank content.
// callback(error, version)
module.exports.insertNew = function(name, callback) {
  var firstVersion = 0.01;
  var script = new Script();
  script.name = name;
  script.latestVersion = firstVersion;
  script.save(function(err){
    var revision = new Revision();
    revision.name = name;
    revision.version = firstVersion;
    revision.save(function(err){
      callback(err,firstVersion);
    });
  });
}

// sets the content of the script with the given name to the given value
// callback(error, version)
module.exports.setContent = function(name, content, message, callback) {
  Script.findOne({ name: name }, function(err, script){
    script.latestVersion = Math.round(script.latestVersion*100+1)/100.0;
    // script.latestVersion + 0.01 leads to stuff like 0.10999999999999999
    
    script.save(function(err){
      var revision = new Revision();
      revision.name = name;
      revision.version = script.latestVersion;
      revision.content = content;
      revision.message = message;
      revision.save(function(err){
        callback(err,revision.version);
      });
    });
  });
};

module.exports.findAllRevisions = function(name, callback){
  Revision.find({ name: name }, callback);
};
