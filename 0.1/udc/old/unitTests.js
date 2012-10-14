//Goals: Serve UN population data via UDC query endpoint.
// Subtasks:
//  Build storage in MongoDB
//   - For Measures
//     - Write unit tests
//       - Test store, find, increment
//   - For Dimensions, Levels, Members
//   - For DataSets
//   - For Observations
//  Import UN Population Data
//  Build query engine
//   - build unit tests
//  Build unit tests
//  Build endpoint
//  Build endpoint test page
var db     = require('./modules/db'),
    assert = require('assert'),
    step   = require('step');

// Connect to the udc-test database
db.connect('udc-test');

var data_year_start = 1950;

var data_year_ids = [];

var data_world_population = [2532229.237,2580959.811,2628448.169,2675766.194,2723726.367,2772881.677,2823513.099,2875642.147,2929068.76,2983434.676,3038412.766,3093909.471,3150241.63,3208212.366,3268896.174,3333007.049,3400823.017,3471955.133,3545612.656,3620652.065,3696186.306,3772048.386,3848319.463,3924667.649,4000764.13,4076419.207,4151409.53,4225863.84,4300401.689,4375899.125,4453007.478,4531799.255,4612119.82,4694097.271,4777827.832,4863289.935,4950590.704,5039478.411,5129112.573,5218374.508,5306425.154,5392938.741,5478009.489,5561743.942,5644416.076,5726239.315,5807211.831,5887259.665,5966464.736,6044931.358,6122770.22,6200002.758,6276721.836,6353195.588,6429757.631,6506649.175,6583958.568,6661637.46,6739610.289,6817737.123,6895889.01];

var population; // the id of the population measure
var time; // the id of the Time dimension
var space; // the id of the Space dimension
var planets; // the id of the Planets level
var world; // the id of the Earth member
var years; // the id of the Years level
var unPopulationDataSet; // the id of the UN Population Data Set
var yearsPlanetsMetaCube; // the id of the metacube with the levels years and planets

// checks for an error and throws it,
// calls the given function with the err omitted.
// This makes for more concise code in a step sequence.
function bubble(fn){
  return function(){
    var err = arguments[0], args = [], i = 1;
    if(err) throw err;
    for(; i < arguments.length; i++)
      args.push(arguments[i]);
    fn.apply(this,args);
  }
}

// Add print statements to db functions
function addPrintStatement(fn, type){
  return function(){
    var name = arguments[0];
    console.log('creating '+type+' "'+name+'"');
    fn.apply(this,arguments);
  }
}

db.getMeasureId = addPrintStatement(db.getMeasureId, 'measure');
db.getDimensionId = addPrintStatement(db.getDimensionId, 'dimension');
db.getLevelId = addPrintStatement(db.getLevelId, 'level');
db.getMemberId = addPrintStatement(db.getMemberId, 'member');
db.getDataSetId = addPrintStatement(db.getDataSetId, 'data set');

step(
  function(){
    db.clear(this);
  },
  bubble(function(){
    db.getMeasureId('Population', this);
  }),
  bubble(function(id){
    assert.equal(id, 1);
    population = id;
    db.getMeasureName(id,this);
  }),
  bubble(function(name){
    assert.equal(name, 'Population');
    db.getMeasureId('Average Income', this);
  }),
  bubble(function(id){
    assert.equal(id, 2);
    db.getMeasureName(id,this);
  }),
  bubble(function(name){
    assert.equal(name, 'Average Income');
    db.getDimensionId('Time', this);
  }),
  bubble(function(id){
    assert.equal(id, 1);
    time = id;
    db.getDimensionId('Space', this);
  }),
  bubble(function(id){
    assert.equal(id, 2);
    space = id;
    db.getLevelId('Years',time, this);
  }),
  bubble(function(id){
    assert.equal(id, 1);
    years = id;
    db.getLevelId('Planets', space, this);
  }),
  bubble(function(id){
    assert.equal(id, 2);
    planets = id;
    db.getMemberId('World',planets,this);
  }),
  bubble(function(id){
    assert.equal(id, 1);
    world = id;
    db.getDataSetId('UN Population',this);
  }),
  bubble(function(id){
    assert.equal(id, 1);
    unPopulationDataSet = id;

    db.getMetaCubeId([years, planets], this);
  }),
  bubble(function(id){
    assert.equal(id, 1);
    yearsPlanetsMetaCube = id;

    // test finding an existing metacube
    db.getMetaCubeId([years, planets], this);
  }),
  bubble(function(id){
    assert.equal(id, 1);

    // test finding an existing metacube with
    // ordering other than original
    db.getMetaCubeId([planets, years], this);
  }),
  bubble(function(id){
    assert.equal(id, 1);
    db.addDataCube(unPopulationDataSet, {
      metaCube: yearsPlanetsMetaCube,
      measures: [population]
    }, this);
  }),
  bubble(function(){
    var yearNumber = data_year_start;
    var lastYearNumber = yearNumber + 5;//yearNumber + data_world_population.length - 1;
    var callback = this;
    var i = 0;
    (function iterate(){
      if(yearNumber > lastYearNumber)
        callback();
      else{
        var yearStr = yearNumber.toString();
        yearNumber++;
        db.getMemberId(yearStr, years, function(err, yearId){
          data_year_ids[i] = yearId;
          var populationValue = data_world_population[i]*1000;
          i++;
          db.insertObservation(unPopulationDataSet, yearsPlanetsMetaCube,[world,yearId],population,populationValue, function(){
            process.nextTick(iterate);
          });
        });
      }
    })();
  }),
 // bubble(function(){
 //   db.executeQuery({
 //     measures: [population],
 //     cells:[{ level: years },
 //            { member: world }]
 //   });
 // }),
  bubble(function(){
    db.disconnect();
  })
);
