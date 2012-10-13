var scripts = require('../modules/scripts');
scripts.clearDB(function(){
  scripts.disconnect();
  console.log("Database cleared.");
});


