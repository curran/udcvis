var canvas = document.getElementById("canvas");
var c = canvas.getContext('2d');

var each = function(arr, callback){
  for(var i = 0; i < arr.length; i++)
    callback(arr[i], i);
}

var minMax = function(data, callback/*(min, max)*/){
  var min = Number.MAX_VALUE, max = -min;
  each(data,function(x){
    if(x > max) { max = x; }
    if(x < min) { min = x; }
  });
  callback(min, max);
}


/**
 * This way of doing things is not appropriate for
 * use in tight loops because it creates 4 new objects
 * on each call, making the garbage collector work hard,
 * slowing performance.
 */
var interpolate = function(value){
  return {
    from: function(min1, max1){
      return {
        to: function(min2, max2){
          return (value - min1) / (max1 - min1) * (max2 - min2) + min2;
        }
      };
    }
  };
};

/**
 * This way of doing things, while more verbose,
 * is appropriate for use in tight loops, 
 * as no new objects are created on each call.
 */
var interpolate = function(){
  var _value, _min1, _max1;
  var chain = {
    from: function(min1, max1){
      _min1 = min1;
      _max1 = max1;
      return chain;
    },
    to: function(min2, max2){
      return (_value - _min1) / (_max1 - _min1) * (max2 - min2) + min2;
    }
  };
  return function(value){
    _value = value;
    return chain;
  };
}();
 
var data = [0,1,2,3,4,5];
var margin = 50;
var xMin = margin, xMax = canvas.width - margin;
var yMin = margin, yMax = canvas.height - margin;
var radiusMin = 2, radiusMax = 40;

var clearBackground = function(){
  c.fillStyle = 'lightgray'
  c.fillRect(0, 0, canvas.width, canvas.height);
};

/**
 * A "mark" is Bertin's notion of a single visualization element, comprised of
 * 
 *  * Position (x, y)
 *  * Value (Luminance)
 *  * Color (Hue)
 *  * Texture
 *  * Shape
 *  * Orientation
 *
 * This function defines a simple mark API that never creates new objects.
 */
var mark = (function(){
  var defaults = {
    x: 0, y: 0, fillStyle: 'black', shape: 'circle', radius: 10
  };
  var TWO_PI = Math.PI * 2;
  var markFunctions = {
    'circle' : {
      /**
       * c = the canvas context
       * p = the mark parameters
       */
      'draw': function(c, p){
        c.fillStyle = p.fillStyle;
        c.beginPath();
        c.arc(p.x, p.y, p.radius, 0, TWO_PI);
        c.fill();
      },
      /**
       * p = the mark parameters
       * callback(x, y, width, height)
       */
      'boundingBox': function(p, callback){
        var s = p.radius * 2;
        callback(p.x, p.y, s, s);
      },
      'insideTest': function(p){
        var _x = p.x;
        var _y = p.y;
        var _radius = p.radius;
        return function(x, y){
          var dx = x - _x;
          var dy = y - _y;
          return dx * dx + dy * dy < _radius * _radius;
        };
      }
    }
  };
  var getShapeFunctions = function(shape){
    var shapeFunctions = markFunctions[shape];
    if(shapeFunctions)
      return shapeFunctions;
    else
      throw(new Error('unknown shape type: "'+this.shape+'"'));
  }
  var markSingleton = {
    properties : {},
    draw : function(context){
      var shapeFunctions = getShapeFunctions(this.properties.shape);
      shapeFunctions.draw(context, this.properties);
    },
    /* callback(x, y, width, height)*/
    boundingBox : function(callback){
      var shapeFunctions = getShapeFunctions(this.properties.shape);
      shapeFunctions.boundingBox(this.properties, callback);
    },
    insideTest: function(){
      var shapeFunctions = getShapeFunctions(this.properties.shape);
      return shapeFunctions.insideTest(this.properties);
    }
  };

  /* Sets up mark().x, mark().y, ... */
  for(var property in defaults){
    markSingleton[property] = (function(property){
      return function(value){
        this.properties[property] = value;
        return this;
      };
    })(property);
  }

  return function(){
    // set defaults on the mark singleton
    for(var property in defaults)
      markSingleton.properties[property] = defaults[property];
    // return the singleton for function chaining
    return markSingleton;
  }
})();
/**
 * This is the way the graphic would be coded without any insights
 * from Bertin's "Semiology of Graphics"
 */
var directMethod = function(){
  clearBackground();
  minMax(data, function(min, max){
    each(data, function(value){
      var x      = interpolate( value ).from( min, max ).to( xMin, xMax);
      var y      = interpolate( value ).from( min, max ).to( yMin, yMax);
      var radius = interpolate( value ).from( min, max ).to( radiusMin, radiusMax);
      c.fillStyle = 'black';
      c.beginPath();
      c.arc(x, y, radius, 0, Math.PI * 2);
      c.fill();
    });
  });
};


var bertinMethod = function(){
  clearBackground();
  minMax(data, function(min, max){
    each(data, function(value){
      mark()
        .x(      interpolate( value ).from( min, max ).to( xMin, xMax))
        .y(      interpolate( value ).from( min, max ).to( yMin, yMax))
        .radius( interpolate( value ).from( min, max ).to( radiusMin, radiusMax))
      .draw(c);
    });
  });
};

directMethod();
bertinMethod();

/**
 * 9/3/2012 An experiment in adding a spatial index.
 */

var spatialIndex = (function(){
  /* each has x, y, width, height */
  var boundingBoxes = {};
  /* each is a function(x, y){ returns true or false } */
  var insideTestFunctions = {};
  return {
    insert: function(id, boundingBox, insideTestFunction){
      boundingBoxes[id] = boundingBox;
      insideTestFunctions[id] = insideTestFunction;
    },
    query: function(x, y){
      for(var id in boundingBoxes){
        var bb = boundingBoxes[id];
        if(x > bb.x & x < bb.x + bb.width)
          if(y > bb.y & y < bb.y + bb.height)
            if(insideTestFunctions[id](x, y))
              return id;
      }
      return undefined;
    }
  };
})();

var selectedMarkId;
function generateMark(value, min, max){
  return mark()
    .x(      interpolate( value ).from( min, max ).to( xMin, xMax))
    .y(      interpolate( value ).from( min, max ).to( yMin, yMax))
    .radius( interpolate( value ).from( min, max ).to( radiusMin, radiusMax));
}
var spatialIndexMethod = function(){
  clearBackground();
  minMax(data, function(min, max){
    each(data, function(value, id){
      var mark = generateMark(value, min, max);
      mark.draw(c);
      mark.boundingBox(function(x, y, width, height){
        var boundingBox = {
          x: x, y: y, width: width, height: height
        };
        spatialIndex.insert(id, boundingBox, mark.insideTest());
      });
    });
  });
};
spatialIndexMethod();

document.addEventListener('mousemove', function(e){
  spatialIndexMethod();
  var selectedMarkId = spatialIndex.query(e.x, e.y);
  if(selectedMarkId)
    minMax(data, function(min, max){
      var mark = generateMark(data[selectedMarkId].value);
      mark.fillStyle('red');
      console.log("here");
      mark.draw(c);
    });
});
