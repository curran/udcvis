/**
 * Parses a single line of a CSV file
 * into tokens and returns the tokens
 * in an array of strings. Quoted entries
 * are taken out of quotes, and commas
 * within quotes are handled properly.
 *
 * The 'line' argument is expected to be
 * a single line of a CSV file, not
 * containing a newline.
 */
function parseCSVRow(line){
  var tokens = [] ,token = ""
     ,state = 0 ,i;
  for(i = 0; i < line.length; i++){
    var c = line.charAt(i);
    switch(state){
      case 0:// The first character of a cell
        if(c === '"') // If it begins with a quote,
          state = 1;  // it needs to end with a quote.
        else{ //otherwise,
          token += c; //add the current character to the token
          state = 3; // and parse the rest of the token
        }
        break;
      case 1:// After the opening quote has been parsed,
        if(c === '"'){// parse the closing quote,
          tokens.push(token);// store the token,
          token = "";// get ready for the next token
          state = 2;//parse the next comma
        }
        else //parse the characters within quotes
          token += c;
        break;
      case 2:// After the closing quote,
        if(c === ","){ //parse the next comma,
          state = 0; // get ready to parse the next cell
          if(i === line.length - 1) //if the last cell is empty,
            tokens.push("");// count it as an empty string token
        }
        break;
      case 3:// After the first character was not a quote
        if(c === "," || i == line.length - 1){
          //parse the next comma,
          //or store the last token if end of line is reached
          state = 0; // get ready to parse the next cell
          tokens.push(token);// store the token,
          token = "";// get ready for the next token
        }
        else // parse the characters not in quotes
          token += c;
        break;
    }
  }
  return tokens;
}
var _readStream;
/**
 * @param readStream the read stream of the CSV file
 * @param processCSVRow(rowNum, tokens, callback) A function where
 *   - rowNum is the row number
 *   - tokens is an array of strings in the row
 *   - callback is a function to be called after the row is processed.
 */
module.exports.parseStream = function(readStream, processCSVRow){
  _readStream = readStream;
  var buffer = '';
  var bufferIndex = 0;
  var rowNum = 0;
  function drainBuffer(callback){
    while(true){
      if(bufferIndex < buffer.length){
        var c = buffer[bufferIndex++];
        if(c === '\n'){
          var line = buffer.substr(0,bufferIndex - 1);
          var tokens = parseCSVRow(line);
          buffer = buffer.substr(bufferIndex);
          bufferIndex = 0;
          return processCSVRow(rowNum++, tokens, function(){
            drainBuffer(callback);
          });
        }
        else
          line += c;
      }
      else
        return callback();
    }
  }
  
  readStream.on("data", function(data){
    buffer += data;
    var self = this;
    self.pause();
    drainBuffer(function(){
      self.resume();
    });
  });
}
module.exports.destroyStream = function(){
  if(_readStream)
    _readStream.destroy();
  else
    throw new Error('destroyStream called while no stream open!');
};
