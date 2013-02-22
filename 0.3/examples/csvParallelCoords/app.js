// The simplest possible code to 
// draw a scatter plot from CSV data.
require(["jquery.csv","text!../../data/iris.csv"], function(csv, data){
  var table = ($.csv.toArrays(data)),
      canvas = document.getElementById("canvas"),
      c = canvas.getContext("2d");

  function computeMetadata(){
    var i, j, row, str, val, meta,
        columns = [4, 2, 3, 0, 1],
        columnsMetadata = [],
        createMetadata = function(columnIndex){
          var meta = {
            columnIndex: columnIndex,
            min: Number.MAX_VALUE,
            max: -Number.MAX_VALUE,
            uniqueStrings: {},
            uniqueStringsCounter: 1,
            stringToNumber: function(str){
              var n = meta.uniqueStrings[str], count;
              if(!n){
                count = meta.uniqueStringsCounter++;
                n = meta.uniqueStrings[str] = count;
              }
              return n;
            }
          };
          return meta;
        };

    // Initialize column matadata
    for(i = 0; i < columns.length; i++){
      meta = createMetadata(columns[i]);
      columnsMetadata.push(meta);

      // Compute min and max for each axis column
      for(j = 1; j < table.length; j++){
        row = table[j];
        str = row[meta.columnIndex];
        val = parseFloat(str);
        if(isNaN(val))
          val = meta.stringToNumber(str);
        if(val < meta.min)
          meta.min = val;
        if(val > meta.max)
          meta.max = val;
      }
    }
    
    return columnsMetadata;
  }

  function plot(columnsMetadata){
    var i, j, row, str, val, meta,
        x1, y1, x2, y2,
        n = columnsMetadata.length,
        getVal = function(row, meta){
          str = row[meta.columnIndex];
          val = parseFloat(str);
          if(isNaN(val))
            val = meta.stringToNumber(str);
          return val;
        };

    c.strokeStyle = "rgba(0,0,0,0.1)";
    c.lineWidth = 2;
    for(i = 0; i < n - 1; i++){
      meta1 = columnsMetadata[i];
      meta2 = columnsMetadata[i+1];
      for(j = 1; j < table.length; j++){
        row = table[j];
        val1 = getVal(row, meta1);
        val2 = getVal(row, meta2); 

        x1 = i / (n-1) * canvas.width;
        y1 = ( 1 - (val1 - meta1.min) 
                 / (meta1.max - meta1.min))
             * canvas.height;

        x2 = (i+1) / (n-1) * canvas.width;
        y2 = ( 1 - (val2 - meta2.min) 
                 / (meta2.max - meta2.min))
             * canvas.height;

        c.beginPath();
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
        c.closePath();
        c.stroke();
      }
    }
  }

  plot(computeMetadata());
});
