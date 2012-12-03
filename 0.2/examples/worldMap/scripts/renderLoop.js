define(['udcvis/requestAnimFrame', 'underscore'],
    function(requestAnimFrame, _){
  // `frameSteps` is an array of per-frame
  // callback functions.
  var frameSteps = [],
      executeFrameSteps = function(){
        _(frameSteps).each(function(callback){
          callback();
        });
      },
      executeFrame = function(){
        requestAnimFrame(executeFrame);
        executeFrameSteps();
      };

  return {
    // `addFrameSteps(callbacks)` 
    //
    //  * Takes as input an array of functions that
    //    will get called each frame.
    addFrameSteps: function(callbacks){
      _(callbacks).each(function(callback){
        frameSteps.push(callback);
      });
    },
    start: executeFrame
  };
});
