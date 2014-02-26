rdfstore.create(function(store) {
  var remoteGraphUri = 'data/cubeExample.ttl';

  var query = [
    'PREFIX qb: <http://purl.org/linked-data/cube#>',
    'PREFIX dct: <http://purl.org/dc/terms/>',
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    'SELECT ?dataset ?title',
    'WHERE {',
    '  ?dataset a qb:DataSet.',
    '  ?dataset dct:title ?title',
    '}'
  ].join('\n');

  //'SELECT * { ?s ?p ?o }'

  store.load('remote', remoteGraphUri, function(success, results) {
    store.execute(query, function(success, results) {
      console.log(results);
    });
  });
})
