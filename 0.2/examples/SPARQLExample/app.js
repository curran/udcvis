require(['jquery','udcvis/requestAnimFrame','udcvis/resizeCanvas'], 
    function($, requestAnimFrame, resize) {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');

  var resourcePrefix = 'http://dbpedia.org/resource/';

  function removeResourcePrefix(str){
    var i = str.indexOf(resourcePrefix);
    i += resourcePrefix.length;
    return str.substr(i);
  }
   
  function dbPediaURIToEnglishLabel(uri){
    return removeResourcePrefix(uri).replace(/_/g," ");
  }

  var query = [
    'http://dbpedia.org/sparql?query=',
      'PREFIX dbo: <http://dbpedia.org/ontology/>',
      'SELECT DISTINCT ?country WHERE {',
      '  ?country rdf:type dbo:Country.',
      '} LIMIT 50',
    '&format=json'
  ].join('\n');

  var results;

  $.get(query, function(result) {
    results = result.results.bindings;
    drawResults();
  });

  function drawResults(){
    for(i in results){
      var uri = results[i]["country"]["value"],
          label = dbPediaURIToEnglishLabel(uri),
          x = Math.random() * canvas.width,
          y = Math.random() * canvas.height;

      c.font         = '20px Sans-Serif';
      c.fillText  (label, x, y);
    }
  }

  (function render(){
    requestAnimFrame(render);
    if(resize(canvas)){
      drawResults();
    }
  })();
});
