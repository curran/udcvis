define([],function(){
  var proto = {
    set: function(xOrRect, y, width, height){
      if(arguments.length === 4){
        this.x = xOrRect;
        this.y = y;
        this.width = width;
        this.height = height;
      } else if(arguments.length === 1){
        var rect = xOrRect;
        this.x = rect.x;
        this.y = rect.y;
        this.width = rect.width;
        this.height = rect.height;
      } 
    },
    contains: function(vertex){
      return (vertex.x > this.x &&
              vertex.y > this.y && 
              vertex.x < this.x + this.width &&
              vertex.y < this.y + this.height)
    },
    print: function(){
      console.log({
        x: this.x, y: this.y, 
        width: this.width, height: this.height
      });
    }
  };
  return {
    create: function(x, y, width, height){
      var getSetX = {
            get: function(){
              return x;
            },
            set: function(newX){
              x = newX;
            }
          }, 
          getSetY = {
            get: function(){
              return y;
            },
            set: function(newY){
              y = newY;
            }
          };
    
      // If arguments are undefined,
      // use defaults (0,0,1,1).
      x = x ? x : 0;
      y = y ? y : 0;
      width = width ? width : 1;
      height = height ? height : 1;

      return Object.create(proto, {
        x: getSetX,
        y: getSetY,
        width: {
          get: function(){
            return width;
          },
          set: function(newWidth){
            width = newWidth;
          }
        },
        height: {
          get: function(){
            return height;
          },
          set: function(newHeight){
            height = newHeight;
          }
        },
        x1: getSetX,
        y1: getSetY,
        x2: {
          get: function(){
            return x + width;
          },
          set: function(x2){
            width = x2 - x;
          }
        },
        y2: {
          get: function(){
            return y + height;
          },
          set: function(y2){
            height = y2 - y;
          }
        },
        centerX: {
          get: function(){
            return x + width / 2;
          }
        },
        centerY: {
          get: function(){
            return y + height / 2;
          }
        }
      });
    }
  };
});
