// Generates a dump of a ProcessingDB store as a text file.
// Given no arguments, the dump is output to stdout.
// If an argument is given, it is interpreted as the name
// of the file in which to write the dump.

var scripts = require('../modules/scripts'),
    fs = require('fs');

var arguments = process.argv.splice(2);
// if no args, write to stdout.
// if one arg, it is the output file name, write to that file
var outputStream;
if(!arguments[0])
  outputStream = process.stdout;
else{
  var outputFileName = arguments[0];
  var outputStream = fs.createWriteStream(outputFileName);
}

scripts.setDirectoryPrefix('..');
scripts.all(function(err, allScripts){
  (function iterateScript(){
    if(allScripts.length === 0){
      scripts.disconnect();
      outputStream.end();
    }
    else {
      var script = allScripts.splice(0,1)[0];
      scripts.findAllRevisions(script.name, function(err, allRevisions){
        outputStream.write(JSON.stringify({
          type:'script',
          name:script.name,
          latestVersion:script.latestVersion
        }));
        outputStream.write('\n');
        (function iterateRevision(){
          if(allRevisions.length === 0)
            iterateScript();
          else {
            var revision = allRevisions.splice(0,1)[0];
            scripts.getContent(revision, function(err, content){
              if(revision.version != scripts.FIRST_VERSION)
                outputStream.write(JSON.stringify({
                  type:'revision',
                  name:revision.name,
                  version:revision.version,
                  message:revision.message,
                  content:content
                })+'\n');
              iterateRevision();
            });
          }
        })();
      });
    }
  })();
});
