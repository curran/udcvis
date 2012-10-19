// Half baked non-working script
var fs = require('fs'),
    csv = require('csv');

var inputFileName = '../UNPopulationSubset.csv';
var readStream = fs.createReadStream(inputFileName, {encoding: 'ascii'});

var prefixes = [
  '@prefix rdf:             <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
  '@prefix rdfs:            <http://www.w3.org/2000/01/rdf-schema#> .',
  '@prefix qb:              <http://purl.org/linked-data/cube#> .',
  '@prefix udc:             <http://universaldatacube.org/> .',
  '@prefix measures:        <http://universaldatacube.org/measures/> .',
  '@prefix dataset:         <http://universaldatacube.org/datasets/UNPopulationEstimates> .',
  '@prefix sdmx-dimension:  <http://purl.org/linked-data/sdmx/2009/dimension#> .',
  '@prefix world:           <http://www.geonames.org/6295630> .'
].join('\n');

var dataSetMetadata = [
  'dataset:',
  '    a qb:DataSet;',
  '    rdfs:label "UN Population Subset";',
  '    rdfs:comment "Data from the United Nations covering world population estimates by year from 1950 to 2010".'
].join('\n');

console.log(prefixes+'\n');
console.log(dataSetMetadata+'\n');

var yearURIPrefix = 'http://reference.data.gov.uk/id/year/';

csv.parseStream(readStream, function(rowNum, tokens, callback){
  console.log("rowNum = "+rowNum);
  console.log("tokens = "+tokens);

  // This row contains population values for the world
  // in thousands of people, so need to multiply to 1000 to 
  // get the real population value in 'number of people'
  //if(rowNum == 1){
    //for(i = 2; i < tokens.length; i++){
    //  var year = i - 2 + 1950;
    //  var yearURI = yearURIPrefix + year;
    //  
    //  var population = parseFloat(tokens[i]);
    //  
    //  var observationTTL = [
    //    'dataset:observation'+(i-2),
    //    '    a qb:Observation ;',
    //    '    qb:dataSet dataset: ;',
    //    '    measures:Population '+population+' ;',
    //    '    sdmx-dimension:refPeriod <'+yearURI+'> ;',
    //    '    sdmx-dimension:refArea world: .'
    //  ].join('\n');
    //  
    //  console.log(observationTTL+'\n');
    //}
  //}
  callback();
});

readStream.on("error", function(err){
  throw err;
});


