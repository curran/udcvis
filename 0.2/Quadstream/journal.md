### Nov. 1

 * Outlined [pseudocode](http://curran.github.com/udcvis/0.2/Quadstream/docs/pseudocode.html).
 * Downloaded Natural Earth Data
   * Highest resolution country boundaries, ~ 6MB.
 * Converted country boundaries to GeoJSON using GDAL.
   * Command: `ogr2ogr -f "GeoJSON" ../outFileName.json inFileName.shp inFileName`
   * See also:
     * [GDAL SHP to GeoJSON Conversion](http://stackoverflow.com/questions/2223979/convert-a-shapefile-shp-to-xml-json)
     * [GDAL Cheatsheet](http://www.bostongis.com/PrinterFriendly.aspx?content_name=ogr_cheatsheet).

<center>
  <img src="data/GeoJSON_idea.png"></img>
  A sample of the GeoJSON file.
</center>

