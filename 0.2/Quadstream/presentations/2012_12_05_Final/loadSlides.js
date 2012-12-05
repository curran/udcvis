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

var steps = [];

var slideWidth = 400,
    slideHeight = 500,
    childCount = function(node){
      return _(node).filter(function(child){
        return typeof child === 'string';
      }).length;
    };

function addOutline(params, node){
  _(node).each(function(child){
    if(typeof child === 'string'){
      steps.push(step(child, params));
      params.y += slideHeight * params.scale;
    }
    else{
      params.x += slideWidth * params.scale;
      params.y -= slideHeight * params.scale;

      params.y -= slideHeight/2 * params.scale;

      params.scale /= childCount(child);

      addOutline(params, child);

      params.scale *= childCount(child);

      params.y += slideHeight/2 * params.scale;

      params.y += slideHeight * params.scale;
      params.x -= slideWidth * params.scale;
    }
  });
}

addOutline({x:0, y:0, scale:1}, outline);

async.series(steps, function(err, results){
  $('#impress')
    .attr('data-min-scale', 1)
    .attr('data-max-scale', 1);
  impress().init();
});
