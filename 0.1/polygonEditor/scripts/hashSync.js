// ## The Hash Synchronization Module
// 
// Responsible for synchronizing the post-hash-symbol
// portion of the URL with the model.
//
// This enables users to store their model in the URLs
// and pass them around as links.
define(['model'], function(model){
  if(location.hash){
    _.each(JSON.parse(location.hash.substr(1)),function(p){
      model.addPoint(p.x, p.y);
    });

    model.trigger('change');
  }


  var timeoutId = 0;
  model.on('change', function(){
    if(timeoutId)
      clearTimeout(timeoutId);
    timeoutId = setTimeout(function(){
      location.hash = JSON.stringify(model.points);
      timeoutId = 0;
    },100);
  });
});
