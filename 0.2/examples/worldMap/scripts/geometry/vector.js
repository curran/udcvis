define([],function(){
  var proto = {
    set: function(x, y){
      this.x = x;
      this.y = y;
    }
  };
  return {
    create: function(x, y){
     
      // If arguments are undefined,
      // use defaults (0,0)
      x = x ? x : 0;
      y = y ? y : 0;

      return Object.create(proto, {
        x: {value: x, writable: true}, 
        y: {value: y, writable: true}
      });
    }
  };
});
