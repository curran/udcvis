# Quadstream Project Journal
##### Curran Kelleher

## 11/1/2012

 * Outlined [pseudocode](http://curran.github.com/udcvis/0.2/Quadstream/docs/pseudocode.html).
 * Downloaded Natural Earth Data
   * [Highest resolution country boundaries, ~ 6MB](http://www.naturalearthdata.com/downloads/10m-cultural-vectors/).
 * Converted country boundaries to GeoJSON using GDAL.
   * Command: `ogr2ogr -f "GeoJSON" ../outFileName.json inFileName.shp inFileName`
   * See [actual build script](https://github.com/curran/udcvis/blob/gh-pages/0.2/Quadstream/data/convertToGeoJSON.sh)
   * See also:
     * [GDAL SHP to GeoJSON Conversion](http://stackoverflow.com/questions/2223979/convert-a-shapefile-shp-to-xml-json)
     * [GDAL Cheatsheet](http://www.bostongis.com/PrinterFriendly.aspx?content_name=ogr_cheatsheet).

<center>
  <img src="images/GeoJSON_idea.png"></img>
  <p>A sample of the GeoJSON file.</p>
</center>

## 11/6/2012
Created quad subdivision test:

 * Computes the quad subdivision of the plane (down 9 levels) to
   accommodate a circle approximated by 300 points.
 * Draws each subdivision as a transpatent black rectangle.
 * The mouse controls the circle center.

<center>
<iframe src="../examples/quadSubdivision/app.html" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="512" height="512"></iframe>
<p><a href="https://github.com/curran/udcvis/blob/gh-pages/0.2/examples/quadSubdivision/app.js">Source</a></p>
</center>

This example demonstrates the fundamental approach of the Quadstream
algorithm, where each input vertex becomes a node in a quadtree. Much
of this example code can be re-used for the implementation of 
the Quadstream algorithm in a command line tool for processing GeoJSON
boundary files.

## 11/11/2012
Created this figure that illustrates the quadtree addressing scheme used by QuadStream:

<div>
<iframe src="../Quadstream/figures/keys/index.html" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="1040" height="257"></iframe>
<p><a href="https://github.com/curran/udcvis/blob/gh-pages/0.2/Quadstream/figures/keys/script.js">Source</a></p>
</div>

## 11/14/2012
Created this interactive figure that illustrates Quadstream generalization of a circle.

<div>
<iframe src="../Quadstream/figures/circleGen/index.html" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="520" height="520"></iframe>
<p><a href="https://github.com/curran/udcvis/blob/gh-pages/0.2/Quadstream/figures/circleGen/script.js">Source</a></p>
</div>

Presented [Mid-project Presentation 1](../Quadstream/presentations/2012_11_14_Progress/)

## 11/28/2012

Presented [Mid-project Presentation 2](../Quadstream/presentations/2012_11_28_Progress/)

## 11/30/2012

Discovered a flaw in the algorithm that causes edges to cross for the Vietnam boundary:

<img src="../Quadstream/figures/errorInVietnam.png"></img>
