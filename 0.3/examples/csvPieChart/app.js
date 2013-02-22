// The simplest possible code to 
// draw a scatter plot from CSV data.
require(["jquery.csv","text!../../data/iris.csv"], function(csv, data){
  var table = ($.csv.toArrays(data)),
      canvas = document.getElementById("canvas"),
      c = canvas.getContext("2d"),
      barColumn = 4,
      barHeightColumn = 0,
      barSpacing = 10 /*pixels*/;

  function computeBars(){
    var i, row, barId, value, bar,
        bars = {},
        makeBar = function(){ 
          return { sum: 0, count: 0 };
        },
        getBar = function(id){
          if(!bars[id])
            bars[id] = makeBar();
          return bars[id];
        };

    // Compute averages for each iris class:
    for(i = 1; i < table.length; i++){
      row = table[i];
      barId = row[barColumn];
      value = parseFloat(row[barHeightColumn]);
      bar = getBar(barId);
      bar.sum += value;
      bar.count++;
    }
    for(barId in bars){
      bar = bars[barId];
      bar.avg = bar.sum / bar.count;
    }
    return bars;
  }

  function plot(bars){
    var n, i, sumTotal, sumSoFar,
        startAngle, endAngle,
        x = canvas.width / 2,
        y = canvas.height / 2,
        radius = Math.min(x, y);

    n = 0;
    sumTotal = 0;
    for(barId in bars){
      sumTotal += bars[barId].sum;
      n++;
    }

    i = 0;
    sumSoFar = 0;
    for(barId in bars){
      startAngle = sumSoFar / sumTotal * Math.PI * 2;
      sumSoFar += bars[barId].sum;
      endAngle = sumSoFar / sumTotal * Math.PI * 2;

      c.beginPath();
      c.moveTo(x, x);
      c.arc(x, y, radius, startAngle, endAngle);
      c.closePath();

      c.fillStyle = gray(i / (n-1) * 0.7);
      c.fill();

      i++;
    }
  }

  function gray(x){
    var g = Math.floor(x * 255);
    return "rgb("+g+","+g+","+g+")";
  }

  plot(computeBars());
});
