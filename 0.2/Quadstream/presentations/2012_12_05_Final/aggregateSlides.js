// An array of markdown strings
var content = [];

function addStep(title, callback){
  $.get('md/'+title+'.md', function(data) {
    content.push(data);
    callback();
  });
}

function step(title){
  return function(callback){
    addStep(title, callback);
  }
}

var steps = [];

function addOutline(node){
  _(node).each(function(child){
    if(typeof child === 'string'){
      steps.push(step(child));
    }
    else{
      addOutline(child);
    }
  });
}

addOutline(outline);

async.series(steps, function(err, results){
  $('#textarea').text(content.join('\n\n'));
});
