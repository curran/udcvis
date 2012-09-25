var rdf = function(){
  // The URI id counter for generating ids
  var idCounter = 0;
  // Keys are URI strings, values are integer URI ids.
  var uriToId = {};
  // Keys are integer URI ids, values are URI strings.
  var idToUri = {};

  // Keys are prefix strings (e.g. 'foaf')
  // Values are URIs
  var prefixes = {};

  // Creates a string keys from two integer IDs.
  var key = function(a, b){
    return a+','+b;
  };

  // The arguments here are either URI ids or the string '?'
  // Only one of the arguments is allowed to be '?'
  // The return value is a list of matching values for the '?'
  var rdf = function(subject, predicate, object){
  };

  // The argument is a URI, either between `<>` or a QName.
  // The return value is an integer value id for that URI.
  rdf.id = function(uri){
    if(uri[0] === '<')
      uri = uri.substring(1, uri.length);
    else if(indexOf(':') != 0)
      uri = prefixes[uri.split(':')[0]]+uri.split(':')[1];

    var id = uriToId[uri];
    if(!id)
      id = uriToId[uri] = idCounter++;
    return id;
  };

  // The arguments for subject and predicate here are URIs.
  // Raw URIs must be enclosed with brackets as in Turtle: `<http:// ... >`
  // The arguments may also be QNames with prefixes registered with `rdf.prefix()`.
  // The object argument may be either a URI or a literal value.
  rdf.insert = function(subject, predicate, object){
    subject = rdf.id(subject);
    predicate = rdf.id(predicate);
    object = rdf.id(object);


    var subjectPredicateKey = key(subject, predicate);
    subjectPredicateIndex.insert(
  };

  return rdf;
}();
rdf.insert('<http://www.w3.org/People/EM/contact#me>',
           '<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>',
           '<http://www.w3.org/2000/10/swap/pim/contact#Person>');
rdf.insert('<http://www.w3.org/People/EM/contact#me>',
           '<http://www.w3.org/2000/10/swap/pim/contact#fullName>',
           "Eric Miller");
rdf.insert('<http://www.w3.org/People/EM/contact#me>',
           '<http://www.w3.org/2000/10/swap/pim/contact#mailbox>',
           '<mailto:em@w3.org>');
rdf.insert('<http://www.w3.org/People/EM/contact#me>',
           '<http://www.w3.org/2000/10/swap/pim/contact#personalTitle>',
           "Dr.");

var me = '<http://www.w3.org/People/EM/contact#me>';
var fullName = '<http://www.w3.org/2000/10/swap/pim/contact#fullName>';
console.log(rdf(me, fullName, '?'));

//Region,Population,Year
//World,2532229237,1950
//Africa,229895014,1950
//Asia,1403388587,1950
//Europe,547287120,1950
//Latin America and the Caribbean,167368224,1950
//Northern America,171614868,1950
//Oceania,12675424,1950
//World,6895889018,2010
//Africa,1022234400,2010
//Asia,4164252297,2010
//Europe,738198601,2010
//Latin America and the Caribbean,590082023,2010
//Northern America,344528824,2010
//Oceania,36592873,2010
