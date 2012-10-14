var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    step     = require('step');

var measureCounter = 0;

var Counters = new Schema({
  _id:String,// the schema name
  count: {type: Number, default: 0}
});

var Measures = new Schema({
  _id: Number,
  name: String
});

var Dimensions = new Schema({
  _id: Number,
  name: String
});

var Levels = new Schema({
  _id: Number,
  name: String
});

var Members = new Schema({
  _id: Number,
  name: String
});

var MetaCubes = new Schema({
  _id: Number,
  levels: [Number]
});

var DataCubes = new Schema({
  metaCube: Number,
  measures: [Number]
});

var DataSets = new Schema({
  _id: Number,
  name: String,
  dataCubes: [DataCubes]
});

var Observations = new Schema({
  dataSet: Number,
  metaCube: Number,
  members: [Number],
  measure: Number,
  value: Number
});

var Counter = mongoose.model('Counter', Counters);
var Measure = mongoose.model('Measure', Measures);
var Dimension = mongoose.model('Dimension', Dimensions);
var Level = mongoose.model('Level', Levels);
var Member = mongoose.model('Member', Members);
var MetaCube = mongoose.model('MetaCube', MetaCubes);
var DataSet = mongoose.model('DataSet', DataSets);
var Observation = mongoose.model('Observation', Observations);

/**
 * Increments the counter associated with the given schema name.
 * @param {string} schemaName The name of the schema for which to
 *   increment the associated counter.
 * @param {function(count)} The callback called with the updated
 *   count (a Number).
 */
function incrementCounter(schemaName, callback){
  Counter.update({ _id: schemaName }, { $inc: {count: 1 } },
                 { upsert: true }, function(err, counter){
    if(err) throw err;
    Counter.findOne({ _id: schemaName }, function(err, counter){
      if(err) throw err;
      callback(counter.count.valueOf());
    });
  });
}

/**
 * A generalized implementation of the following logic:
 *  - Look up a document with the given name
 *  - If it already exists, return its id
 *  - If it does not already exist,
 *    - Create it using the counter for the schema
 *    - Return the new id
 *
 * @param {MongoDB Schema} schema The schema to manipulate
 * @param {string} schemaName The name of the schema to
 *   manipulate (used in the counters collection).
 * @param {string} name the name of the instance
 * @param {fuction(err, id)} callback Called with either an
 *   error or the id of the document.
 */
function getId(schema, schemaName, name, callback){
  var properties = {name: name};
  schema.findOne({name:name},function(err,doc){
    if(err) throw err;
    else if(doc) callback(null, doc._id.valueOf());
    else incrementCounter(schemaName,function(id){
      var doc = new schema();
      doc._id = id;
      //for(property in properties)
      //  doc[property] = properties[property];
      doc.name = name;
      doc.save(function(err,doc){
        if(err) callback(err);
        else callback(null, doc._id.valueOf());
      });
    });
  })
}
/**
 * Gets the id of an existing Measure in the database with
 * the given name. If it doesn't exist, it is created.
 * @param {string} name The name of the measure to create.
 * @param {function(err, measureId) The callback called with 
 * either an error or the id of the measure.
 */
module.exports.getMeasureId = function(name, callback){
  getId(Measure, 'Measure', name, callback);
}
/**
 * Gets the id of an existing Dimension in the database with
 * the given name. If it doesn't exist, it is created.
 * @param {string} name The name of the dimension to create.
 * @param {function(err, dimensionId) The callback called with 
 * either an error or the id of the dimension.
 */
module.exports.getDimensionId = function(name, callback){
  getId(Dimension, 'Dimension', name, callback);
}
/**
 * Gets the id of an existing Level in the database with
 * the given name and parent dimension. 
 * If it doesn't exist, it is created.
 * @param {string} name The name of the level to create.
 * @param {number} dimension The id of the dimension to 
 *   which this level belongs.
 * @param {function(err, levelId) The callback called with 
 * either an error or the id of the level.
 */
module.exports.getLevelId = function(name, dimension, callback){
  //TODO store dimension
  getId(Level, 'Level', name, callback);
}

/**
 * Gets the id of an existing Member in the database with
 * the given name and parent level. 
 * If it doesn't exist, it is created.
 * @param {string} name The name of the member to create.
 * @param {number} level The id of the level to 
 *   which this member belongs.
 * @param {function(err, memberId) The callback called with 
 * either an error or the id of the member.
 */
module.exports.getMemberId = function(name, level, callback){
  //TODO store level
  getId(Member, 'Member', name, callback);
}

/**
 * Gets the name of the Measure with the given id.
 *
 * @param {Number} id The id of the Measure.
 * @param {function(err, name)} callback Called with either an error or the name of the Measure with the given id.
 */
module.exports.getMeasureName = function(id, callback){
  Measure.findOne({_id: id},function(err, doc){
    if(err) callback(err);
    if(!doc) callback(new Error("No measure exists with id '"+id+"'"));
    else callback(null, doc.name.valueOf());
  });
}

/**
 * Gets the id of an existing DataSet in the database with
 * the given name.
 * If it doesn't exist, it is created.
 * @param {string} name The name of the DataSet to create.
 * @param {function(err, dataSetId) The callback called with 
 * either an error or the id of the DataSet.
 */
module.exports.getDataSetId = function(name, callback){
  getId(DataSet, 'DataSet', name, callback);
}

module.exports.getMetaCubeId = function(levels, callback){
  MetaCube.findOne({
    $and: [
      {levels :{ $size: levels.length}},
      {levels :{ $all: levels}}
    ]},function(err,doc){
    if(err) throw err;
    else if(doc) callback(null, doc._id.valueOf());
    else incrementCounter('MetaCube',function(id){
      var doc = new MetaCube();
      doc._id = id;
      levels.forEach(function(level){
        doc.levels.push(level);
      });
      doc.save(function(err,doc){
        if(err) callback(err);
        else callback(null, doc._id.valueOf());
      });
    });
  })
};

module.exports.addDataCube = function(dataSet, dataCube, callback){
  DataSet.findOne({_id:dataSet},function(err, doc){
    if(err) callback(err);
    else if(!doc) callback(new Error('No data set exists with id '+dataSet));
    else{
      console.log(dataCube);
      doc.dataCubes.push(dataCube);
      doc.save(function(err){
        callback(err);
      });
    }
  });
};

//var Observations = new Schema({
//  dataSet: Number,
//  metaCube: Number,
//  members: [Number],
//  measure: Number,
//  value: Number
//});
module.exports.insertObservation = function(dataSet, metaCube, members, measure, value, callback){
  var observation = new Observation();
  observation.dataSet = dataSet;
  observation.metaCube = metaCube;
  observation.measure = measure;
  observation.value = value;
  for(var i=0;i<members.length;i++)
    observation.members.push(members[i]);
  observation.save(function(err,doc){
    if(err) callback(err);
    else callback();
  });
};
/**
 * Connects to the MongoDB database with the
 * specified name residing on localhost.
 *
 * This function exists to enable unit testing
 * code to use a separate database from production
 * code.
 *
 * @param {string} dbName The name of the database
 *   residing on localhost to connect to.
 */
module.exports.connect = function(dbName){
  mongoose.connect('mongodb://localhost/'+dbName);
};

/**
 * Clears the entire database.
 * For use in unit testing.
 *
 * @param {function(err)} callback Called
 *   after the database is cleared.
 */
module.exports.clear = function(callback){
  step(
    function(){ Counter.remove({},this); },
    function(){ Measure.remove({},this); },
    function(){ Dimension.remove({},this); },
    function(){ Level.remove({},this); },
    function(){ Member.remove({},this); },
    function(){ MetaCube.remove({},this); },
    function(){ DataSet.remove({},this); },
    function(){ Observation.remove({},callback); }
  );
};

/**
 * Disconnects from the database (no args, no return value)
 */
module.exports.disconnect = function(){
  mongoose.disconnect();
};
