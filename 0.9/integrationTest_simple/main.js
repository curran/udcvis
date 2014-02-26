d3.json('hierarchy.json', function(hierarchy) {
  d3.json('countryPopulations.json', function(countryPopulations) {
    d3.json('statePopulations.json', function(statePopulations) {
      integrate(hierarchy, countryPopulations, statePopulations);
    });
  });
});

function integrate(hierarchy, countryPopulations, statePopulations){
  var populationByRegion = {};

  countryPopulations.forEach(function(entry){
    populationByRegion[entry.Country] = entry.Population;
  });

  statePopulations.forEach(function(entry){
    populationByRegion[entry.State] = entry.Population;
  });

  function traverse(node) {
    var population = populationByRegion[node.name];
    if(population){
      node.population = population;
    }
    if(node.children) {
      node.children.forEach(traverse);
    }
  }

  traverse(hierarchy);

  console.log(JSON.stringify(hierarchy, null, 2));
}
