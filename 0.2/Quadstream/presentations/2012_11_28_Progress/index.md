<link href="styles.css" rel="stylesheet" />
<br><br><br><br><br><br><br><br><br>
# Quadstream Progress
##### Curran Kelleher
##### 11/28/2012

<br><br><br><br><br><br><br><br>
## Test Data:

 * Circle of 500 points
 * The Koch Curve (down 6 levels)
 * [Natural Earth](http://www.naturalearthdata.com/)
   * [Image](http://www.naturalearthdata.com/downloads/50m-raster-data/50m-natural-earth-1/)
   * [Country Polygons](http://www.naturalearthdata.com/downloads/10m-cultural-vectors/)
     * Originally available as an [ESRI Shapefile](http://en.wikipedia.org/wiki/Shapefile)
     * Converted to [GeoJSON](http://en.wikipedia.org/wiki/GeoJSON) with [GDAL - Geospatial Data Abstraction Library](http://www.gdal.org/)
       * [Resulting file](../../data/ne_10m_admin_0_countries.json) ~25MB.

<br><br><br><br><br><br><br><br><br>
## Demos:

 * [Natural Earth WebGL Globe](../../../examples/naturalEarthWebGLSphere/earth.html)
   * Orthographic projection
   * Interaction techniques
 * [Quadstream Prototype](../../../examples/panZoom/app.html)
   * Controls:
      * h, j, k, l, arrows = pan
      * c, d = zoom
      * s = set to Circle
      * e = set to Koch Curve
      * w, a = scroll through countries 

<br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br>
## Outstanding Issues:

 * Indepence of aspect ratio from input data
 * Clipping to the viewing rectangle
   * Offscreen vertices are currently rendered
   * Demands rectangle - polygon intersection computation
 * Distributing the output among files
 * Fetching and integrating files on demand
 * Using multi-scale data structures for integration and rendering
   * R-Tree
   * BLG Tree
<br><br><br><br><br><br><br><br><br>
