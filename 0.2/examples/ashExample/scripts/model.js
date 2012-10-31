define(['udcvis/ash','circlesASHPlugin'], function(ash, circles){
  ash.useDummyServer();
  return {
    getCircles: function(){
      return ash.list(circles.type);
    },
    createCircle: function(callback){
      return ash.createResource(circles.type, callback);
    }
  };
});
