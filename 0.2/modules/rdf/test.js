var peg = require('pegjs'),
    fs = require('fs'),
    _ = require('underscore'),
    parserFileName = './ttlParser.pegjs',
    testDataFileName = './testData.ttl';
fs.readFile(parserFileName, 'utf8', function(err, parserText) {
  if (err) throw err;
  var parser = peg.buildParser(parserText);

  fs.readFile(testDataFileName, 'utf8', function(err, testData) {
    if (err) throw err;
    var output = parser.parse(testData);
    console.log(JSON.stringify(output, null, " "));

    _(output).each(function(element){
      console.log(element.type);
    });
  });
});
