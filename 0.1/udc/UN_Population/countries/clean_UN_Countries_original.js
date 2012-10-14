var fs = require('fs'),
    lazy = require('lazy'),
    csv = require('./csv');
var inputFileName = "UN_Countries.csv";
var inFileStream = fs.createReadStream(inputFileName, { 'bufferSize': 1  });
inFileStream.on('close', function () {
  console.log('done reading file');
});
var outputFileName = inputFileName+'_fixed';
var outputStream = fs.createWriteStream(outputFileName);
new lazy(inFileStream)
  .lines
  .forEach(
    function(line) 
    {
      var tokens = csv.parseCSVLine(line.toString());
      //console.log("tokens:");
      //process.exit();
      if(tokens.length != 3){
        console.log(line.toString());
        for(var i = 0;i < tokens.length; i++){
          console.log("  "+tokens[i]);
        }
      }

      // fix the three-number codes whose leading
      // zeroes were chopped by Excel
      if(tokens[0].length != 3){
        var t = tokens[0];
        if(t != "Numerical code"){
          if(t.length == 1)
            tokens[0] = "00"+t;
          else if(t.length == 2)
            tokens[0] = "0"+t;
        }
      }
      
      var line = "";
      for(var i = 0; i < tokens.length; i++){
        line += '"'+tokens[i]+'"';
        if(i < tokens.length - 1)
          line += ",";
      }
      console.log(line);
      outputStream.write(line+'\n');
    }
  );
