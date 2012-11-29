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
   * [R-Tree](http://curran.github.com/udcvis/0.1/quadstream2010/Quadstream00/src/main/webapp/tests/rtree/rtreeTest.html)
   * [BLG Tree](http://curran.github.com/udcvis/0.1/quadstream2010/Quadstream00/src/main/webapp/tests/blgtree/BLGTreeTest.html)

<br><br><br><br><br><br><br><br><br>

## Data of Interest

If you could ask the universe any question of the form

 * Show me data using color on a map
 * For each country of the world
 * For some measure (i.e. indicator, statistic)

What would you ask?

 * [CO2 Emissions Per Capita](http://upload.wikimedia.org/wikipedia/commons/4/4b/CO2_per_capita_per_country.png)
 * [Energy Consumption Per Capita](http://burnanenergyjournal.com/wp-content/uploads/2011/12/WorldMap_EnergyConsumptionPerCapita_v4forweb.jpg)
 * [Life Expectancy](http://upload.wikimedia.org/wikipedia/commons/d/d8/Life_Expectancy_2011_CIA_World_Factbook.png)

<br><br><br><br><br><br><br><br><br>

## Project Context and Broader Vision

Issues and desires immediately arise:

 * I want to zoom in
 * I want labels
 * I want to change the color scale
 * I want to break down the data
   * e.g. where life expectancy is 40,
   * what are the causes of death?
   * as a pie chart

All this can be done, if the visualizations were _software_ rather than static images.

Quadstream is part of a [larger project](http://universaldatacube.org) that aims to

 * Expose useful public data
 * Allow people to build Web-based interactive visualizations for that data
 * Support, among other visualizations, choropleth maps with
   * zooming and panning with dynamic level of detail, and
   * automatic hierarchical breakdown of the data
     * e.g. USA &rarr; US States &rarr; US Counties
<br><br><br><br><br><br><br><br><br>
