function addStep(title, params, callback){
  $.get('md/'+title+'.md', function(data) {
    var slideHTML = marked(data);
    $('#impress').append('<div></div>');
    $('#impress div:last-child')
      .attr('id', title)
      .attr('data-x', params.x)
      .attr('data-y', params.y)
      .attr('data-scale', params.scale)
      .addClass('step')
      .html(slideHTML);
    callback(null);
  });
}

function step(title, params){
  params = _.clone(params);
  return function(callback){
    console.log("adding "+title);
    addStep(title, params, callback);
  }
}

var p = {x:0, y:0 , scale: 1};
var translate = function(x, y){
  p.x += x * p.scale;
  p.y += y * p.scale;
};
var scale = function(scale, callback){
  p.scale *= scale;
  callback();
  p.scale /= scale;
};
var steps = [];
var halfPage = 500;

//var structure = [
//  'titlePage', [
//    'introduction', [
//      'publicData',
//      'choropleth',
//      'webVis'
//    ],
//    'priorArt',[
//      'webChoro'
//    ]
//  ]
//];

//(function buildPresentation(tree){
//  if(typeof tree === 'string'){
//    steps.push(step(tree, p));
//  }
//  else{
//    var n = tree.length;
//    translate(halfPage, 0);
//      scale(0.5);
//        translate(0, - halfPage * (n - 1));
//        _(tree).each(function(child){
//          buildPresentation(child);
//          translate(0, halfPage );
//        });
//        translate(0, - halfPage * (n - 1));
//      scale(2)
//    translate(-halfPage, halfPage);
//  }
//})(structure);

steps.push(step('titlePage', p));
translate(halfPage * 1.1, 0);
scale(0.35, function(){
  translate(0, -halfPage * 1.5);
  steps.push(step('introduction', p));
  translate(halfPage, 0);
  scale(0.5, function(){
    translate(0, -halfPage * 1.3);
    steps.push(step('publicData', p));
    translate(0, halfPage);
    steps.push(step('choropleth', p));
    translate(0, halfPage * 1.1);
    steps.push(step('webVis', p));
    translate(0, -halfPage );
  });
  translate(-halfPage, halfPage * 1.5);
  steps.push(step('priorArt', p));
  translate(halfPage, 0);
  scale(0.5, function(){
    translate(0, - halfPage);
    steps.push(step('webVisTools', p));
    translate(0, halfPage);
    steps.push(step('multiScale', p));
    translate(0, halfPage);
    steps.push(step('lineGen', p));
    translate(0, - halfPage);
  });
  translate(-halfPage, halfPage * 1.5);
  steps.push(step('solution', p));
  translate(halfPage, 0);
  scale(0.5, function(){
    var height = halfPage * 1.2;
    translate(0, - height / 2);
    steps.push(step('quadSubdivision', p));
    translate(0, height);
    steps.push(step('circleGen', p));
    translate(0, - height / 2);
  });
  translate(-halfPage, 0);

  translate(0, halfPage * 1.4);
  steps.push(step('refs', p));
});

async.series(steps, function(err, results){
  $('#impress')
    .attr('data-min-scale', 1)
    .attr('data-max-scale', 1);
  impress().init();
});
