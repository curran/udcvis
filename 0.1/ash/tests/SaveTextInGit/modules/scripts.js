var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    git      = require('./git');

var Revisions = new Schema({
  name: String,
  version: Number,
  message: {type: String, default:''}
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

var firstVersion = 0;

module.exports.FIRST_VERSION = firstVersion;

// Clear the DB for testing
module.exports.clearDB = function(callback){
  Revision.remove({},function(){
    Script.remove({},callback);
  });
}

// Finds all scripts, callback(err, allScripts)
module.exports.all = function(callback){
  Script.find({},callback);
};

// inserts a new script with the given name and blank content.
// callback(error, version)
module.exports.insertNew = function(name, callback) {
  var script = new Script(), revision = new Revision();
  script.name = revision.name = name;
  script.latestVersion = revision.version = firstVersion;
  script.save(function(err){
    if(err) callback(err);
    else revision.save(function(err){
      if(err) callback(err);
      else git.createRepo(name,function(err){
        if(err) callback(err);
        else git.tagRepo(name, firstVersion, function(err){
          callback(err,firstVersion);
        });
      });
    });
  });
}

// sets the content of the script with the given name to the given value
// callback(error, version)
module.exports.setContent = function(name, content, message, callback) {
  Script.findOne({ name: name }, function(err, script){
    script.latestVersion = Math.round(script.latestVersion*100+1)/100.0;
    // script.latestVersion + 0.01 leads to stuff like 0.10999999999999999
    if(err) callback(err);
    else script.save(function(err){
      var revision = new Revision();
      revision.name = name;
      revision.version = script.latestVersion;
      revision.message = message;
      revision.save(function(err){
        if(err) callback(err);
        else git.setContent(name, content, function(err){
          if(err) callback(err);
          else git.tagRepo(name, revision.version, function(err){
            callback(err,revision.version);
          });
        });
      });
    });
  });
};


// gets the content of the script with the given name and version.
// getContent(name, version, callback(err, content))
module.exports.getContent = git.getContent;

// finds all revisions of the given script.
// callback(err, revisions)
module.exports.findAllRevisions = function(name, callback){
  Revision.find({ name: name }, callback);
};

module.exports.disconnect = function(){
  mongoose.disconnect();
};

// sets the prefix of the directory path used.
// stays the default when running app.js
// must be changed when node working dir is different (e.g. in export.js)
module.exports.setDirectoryPrefix = git.setDirectoryPrefix;
