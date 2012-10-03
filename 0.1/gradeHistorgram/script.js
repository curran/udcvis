// This script draws a histogram for a set of grades on an HTML5 canvas.
// ## Configurable variables
var grades = [20, 20, 18, 17, 20, 19, 15, 20, 17, 20, 20, 20, 16, 18, 19, 19, 20, 19, 17, 19, 18, 17, 17, 18, 19, 20, 18, 20, 19, 20, 20, 19, 20, 20];

var margin = {
  bottom: 20,
  top: 5
};

var barSpacing = 5;

var labelYOffset = 15;

var fontSize = 15;

// ## Graphics utilities
// The script expects the containing HTML page to contain a canvas element 
// whose id is "canvas".
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var drawRectangle = function(x1, x2, y1, y2){
  var x = x1, y = y1,
      width = x2 - x1, height = y2 - y1;
  c.fillRect(x, y, width, height);
}

var plotBounds = {
  xMin: 0,
  xMax: canvas.width,
  yMin: canvas.height - margin.bottom,
  yMax: margin.top
};

// ## Functional programming utilities
var each = function(arr, callback/*(element, i)*/){
  for(var i = 0; i < arr.length; i++)
    callback(arr[i], i);
};

var map = function(arr, callback/*(element, i)*/){
  var mappedArr = [];
  for(var i = 0; i < arr.length; i++)
    mappedArr.push(callback(arr[i], i));
  return mappedArr;
}

// Given an array of strings, this function returns an array
// of integers parsed from those strings.
//
// For example, `ints(["5","10","15"])` = `[5,10,15]`.
var ints = function(arr){
  return map(arr, function(elem){
    return parseInt(elem, 10);
  });
};

// Computes the min and max values for a given array of numbers.
// The callback is called with the min and max as arguments.
// 
// For example, `minMax([0,5,15],function(min, max){console.log(min,max);})`
// prints "0 15".
var minMax = function(arr, callback/*(min, max)*/){
  var min = Number.MAX_VALUE, max = -min;
  each(arr,function(x){
    if(x > max) { max = x; }
    if(x < min) { min = x; }
  });
  callback(min, max);
};

// Returns the keys of a given object as an array.
var keys = function(obj){
  var arrKeys = [];
  for(var key in obj)
    arrKeys.push(key);
  return arrKeys;
};

// Returns the values of a given object as an array.
var values = function(obj){
  var arrValues = [];
  for(var key in obj)
    arrValues.push(obj[key]);
  return arrValues;
};

// Returns an array of integers between min and max (inclusive).
var range = function(min, max){
  var i, arr = [];
  for(i = min; i <= max; i++)
    arr.push(i);
  return arr;
};

// ## Linear Interpolation Utilities
/**
 * This way of implementing interpolation is not appropriate for
 * use in tight loops because it creates 4 new objects
 * on each call, making the garbage collector work hard,
 * slowing performance.
 */
var interpolate_crappyImplementation = function(value){
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

// This exposes an API that looks like this when used: 
// `interpolate(value).from(min1, max1).to(min2, max2)`.
// The `value` passed in initially is expected to fall within
// the interval (min1, min2). The returned value is a linear
// interpolation of the original value to a value within the
// interval (min2, max2).
//
// For example, `interpolate(0.5).from(0,1).to(0,100)` = 50.
/**
 * This way of implementing interpolation, while more verbose,
 * is appropriate for use in tight loops, 
 * as no new objects are created on each call.
 * All objects are created once, stored in a
 * closure, and re-used on each call.
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

// ## Grade Bins

// Keys are integer grades that define bins.
// Values are integer sums for occurances those grades.
var gradeBins = {};

var addGradesToBins = function(){
  each(grades, addGradeToBins);
}

var addGradeToBins = function(grade){
  gradeBins[grade] = (gradeBins[grade] || 0) + grade;
};

// ## Drawing Bars
var drawBarsFromBins = function(){
  minMax(ints(keys(gradeBins)), function(minGrade, maxGrade){
    var barWidth = canvas.width / (maxGrade - minGrade + 1)
    barWidth -= barSpacing;

    minMax(values(gradeBins), function(minGradeBinSum, maxGradeBinSum){
      // Set `minGradeBinSum = 0` so the bar chart shows bars that
      // start from 0 rather than the minimum grade bin sum value.
      minGradeBinSum = 0;
      each(range(minGrade, maxGrade), function(grade, i){
        var gradeBinSum = gradeBins[grade] || 0,
            barX1 = interpolate(grade)
                     .from(minGrade, maxGrade)
                     .to(plotBounds.xMin, plotBounds.xMax - barWidth),
            barX2 = barX1 + barWidth,
            barY1 = plotBounds.yMin,
            barY2 = interpolate(gradeBinSum)
                     .from(minGradeBinSum, maxGradeBinSum)
                     .to(plotBounds.yMin, plotBounds.yMax),
            labelX = (barX1 + barX2) / 2,
            labelY;

        // Draw the bar.
        drawRectangle(barX1, barX2, barY1, barY2);

        // Draw the white text inside the bar.
        labelY = barY2 + labelYOffset;
        c.font = fontSize+'px san-serif';
        c.textAlign = "center";
        c.fillStyle = "white";
        c.fillText(gradeBinSum, labelX, labelY);

        // Draw the black text under the bar.
        labelY = barY1 + labelYOffset;
        c.textAlign = "center";
        c.fillStyle = "black";
        c.fillText(grade, labelX, labelY);
      });
    });
  });
}
// ## The Main Program
addGradesToBins();
drawBarsFromBins();
