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
    var n = 0, i = 0,
        x, y, w, h,
        maxX, avg, maxAvg = -Number.MAX_VALUE;

    for(barId in bars){
      avg = bars[barId].avg;
      if(avg > maxAvg)
        maxAvg = avg;
      n++;
    }

    w = canvas.width / n - barSpacing;
    maxX = canvas.width - w;

    for(barId in bars){
      avg = bars[barId].avg;
      x = (i / (n-1)) * maxX;
      h = avg / maxAvg * canvas.height;
      y = canvas.height - h;
      c.fillRect(x, y, w, h);
      i++;
    }
  }

  plot(computeBars());
});
