// The simplest possible code to 
// draw a scatter plot from CSV data.
require(["jquery.csv","text!iris.csv"], function(csv, data){
  var table = ($.csv.toArrays(data)),
      canvas = document.getElementById("canvas"),
      c = canvas.getContext("2d");

  function plot(){
    var i, j, row, x, y,
        xColumn = 0, yColumn = 1,
        xMin = Number.MAX_VALUE,
        xMax = -Number.MAX_VALUE,
        yMin = Number.MAX_VALUE,
        yMax = -Number.MAX_VALUE;

    // Compute min and max
    for(i = 0; i < table.length; i++){
      row = table[i];
      x = row[xColumn];
      y = row[yColumn];
      if(x < xMin)
        xMin = x;
      if(x > xMax)
        xMax = x;
      if(y < yMin)
        yMin = y;
      if(y > yMax)
        yMax = y;
    }

    // Draw the plot
    for(i = 0; i < table.length; i++){
      row = table[i];
      x = row[xColumn];
      y = row[yColumn];

      x = (x - xMin) / (xMax - xMin) * canvas.width;
      y = (y - yMin) / (yMax - yMin) * canvas.height;

      c.fillRect(x, y, 5, 5);
    }
  }

  plot();
});
