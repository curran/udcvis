<link href="styles.css" rel="stylesheet" />

# Quadstream

<h2 class="subtitle">Algorithms for Multi-scale<br>Polygon Generalization</h2>

##### Curran Kelleher<br>December 5, 2012

## Introduction

The goal of this project is to enable the implementation of highly interactive choropleth maps on the Web that support smooth zooming and panning with variable resolution. Choropleth Maps, also known as "Thematic Maps", assign color to geographic regions based on some data. Numerous visualization libraries and toolkits support creation of choropleth maps. For example, here is a [choropleth map created using D3](http://bl.ocks.org/4060606):

<img class="figure" src="images/d3Choropleth.png"></img>

The target data to be visualized includes public data sets that have

 * many various measures that could be visualized using color
 * temporal variance (e.g. yearly data), and
 * hierarchical structure (e.g. Continents, Countries, States).

The desired choropleth map therefore must have the following properties:

 * instant response when the user changes either
   * the measure to visualize
   * the color map used
   * the time slice viewed
 * support for zooming and panning to explore the hierarchy

Here is a sketch of what the user interface might look like for time navigation:

<img class="figure" src="images/Sketch.png"></img>

Examples of public data available include:

 * [CO2 Emissions Per Capita](http://upload.wikimedia.org/wikipedia/commons/4/4b/CO2_per_capita_per_country.png)
 * [Energy Consumption Per Capita](http://burnanenergyjournal.com/wp-content/uploads/2011/12/WorldMap_EnergyConsumptionPerCapita_v4forweb.jpg)
 * [Life Expectancy](http://upload.wikimedia.org/wikipedia/commons/d/d8/Life_Expectancy_2011_CIA_World_Factbook.png)
 
When developing choropleth maps to run in a Web Browser, one must consider bandwidth limitations. To keep download sizes small, existing solutions typically either use a fixed polygon generalization, or image tiles rendered on the server side. Fixed generalization leads to rough looking polygon boundaries when zooming in. Use of server-side image tiles demands a round trip to the server for re-rendering. Our desired choropleth map tool cannot use fixed generalization, as we require high quality polygon boundaries at any zoom level. The image tile approach cannot be used user interactions that cause re-rendering must be instant, and not require a round trip to the server.

The contribution of this project is a set of algorithms and data structures for building client-side rendered choropleth maps with multi-scale polygon generalization. This approach fulfills all the requirements for our choropleth map application, and can be re-used by researchers and software developers looking for a solution for creating a highly performant interactive Web-based choropleth map with smooth zooming and panning and support for hierarchical polygons.

## Related Work

In this section prior work is surveyed in the areas of multi-scale structures, line and polygon generalization algorithms, and web-based choropleth map visualization tools.

### Multi-Scale Structures
Multi-scale data structures and algorithms have been devised to cope with data at multiple scales (i.e. varying "zoom level" or "level of detail"). These approaches often involve recursive partitioning of a space into a data structure that can be efficiently queried. Multi-scale structures related to this work include the Quadtree, R-Tree, [Reactive Tree](http://www.mapcontext.com/autocarto/proceedings/auto-carto-10/pdf/the-reactive-tree-a-storage-structure-for-a-seamless.pdf), and BLG Tree.

The quadtree data structure recursively subdivides a bounding box into four quadrants, or "buckets". For a point quadtree, each bucket is subdivided as long as it contains above a certain threshold number of vertices.

<img class="figure" width="400" src="images/quadtree.png"></img>

<p class="caption">An example point quadtree, from [Wikipedia](http://en.wikipedia.org/wiki/Quadtree).</p>

The R-Tree data structure is a rectangle-based tree structure designed to support efficient rectangle intersection or containment testing.

<img class="figure" width="600" src="images/rTree.svg"></img>
<p class="caption">An example R-Tree, from [Wikipedia](http://en.wikipedia.org/wiki/R-tree).</p>

The [Reactive Tree](http://www.mapcontext.com/autocarto/proceedings/auto-carto-10/pdf/the-reactive-tree-a-storage-structure-for-a-seamless.pdf) data structure aims to provide a multi-scale solution for dynamic generalization using simplification (removal of vertices in lines and polygons), aggregation (summarizing many features with fewer), symbolization (representing polygons with lines or points), and selection (omission of features). 

The Binary Line Generalization Tree (BLG-Tree) is one component of the Reactive Tree that supports efficient rendering of pre-computed line generalizations at multiple scales. The BLG-Tree is a binary tree in which an inorder traversal yields the original ordering of the vertices, and the depth of each node corresponds to its "importance level", a value determining at which scale the vertex should be present. To render a polygon or line at a given resolution, thr tree is traversed only to the depth required to reach the importance threshold determined by the scale of the viewing region.

<img class="figure" src="../../figures/blgTree.png"></img>
<p class="caption">An example BLG-Tree shown with its corresponding line, simplified using the Douglas-Peucker algorithm. From the [Reactive Tree Paper](http://www.mapcontext.com/autocarto/proceedings/auto-carto-10/pdf/the-reactive-tree-a-storage-structure-for-a-seamless.pdf).</p>

### Line Generalization Algorithms
Line generalization refers to the process of modifying high resolution lines or polygons for presentation at a lower resolution. Some line generalization algorithms function by choosing original vertices to "keep", and others introduce vertices that were not there in the original data. The two most relevant line generalization algorithms for this work are the Douglas-Peucker Algorithm and the Li-Openshaw Algorithm.

The Douglas-Peucker algorithm appears to be the most widely used algorithm for line generalization. It works by recursively subdividing the list of vertices in the line until the "error" (perpendicular distance) is below a certain threshold value.

The Li-Openshaw Algorithm works by imposing a raster grid over the line and selecting vertices such that each cell of the raster grid that contains vertices is represented by a single vertex. There are several variations of this algorithm; one that introduces points not in the original data (such as the cell center, or average between enter and exit points), and one that uses the original vertices.

### Web-based Map Visualizations
Many Web-based choropleth map tools exist today. Most, if not all, of them use either fixed line generalization (most likely using the Douglas-Peucker algorithm) or use an image tile approach in which images are rendered on the server side, cached, and delivered to clients when needed.

Here is a selection of several tools:

 * [GapMinder](http://www.gapminder.org/world/) - Though not a choropleth map, this tool is a widely known example of Web-based map visualization.
 * [Tableau Public](http://www.tableausoftware.com/public/gallery/home-financing) - This tool supports choropleth maps with panning and zooming, in conjunction with other visualizations, and uses a server-side-rendering approach.
 * [D3](http://bl.ocks.org/4060606) - This is a library for implementing client-side rendered visualizations, including choropleth maps, using Scalable Vector Graphics (SVG). D3 choropleth maps use a fixed polygon generalization.
 * [CNN Economy Tracker](http://www.cnn.com/SPECIALS/map.economy/) - This visualization tool for economic data uses a fixed generalization and is a perfect example where zooming and panning would be useful (as the data is present for US State and US County levels, but not presented in the tool).
 * [Weave](http://www.oicweave.org/) - This project supports dynamic resolution choropleth maps with zooming and panning, but the algorithms involved have not been published.

## Quadstream
Our solution, which we call "Quadstream", involves the combination of the Quadtree recursive subdivision pattern with the Li-Openshaw line generalization algorithm. The result can be partitioned into small files. The client can consume these files as they are neede to fill in detail on demand, as the user zooms and pans.

The Quadstream algorithm works in two phases; the publishing phase and the consumption phase.

### Publishing Phase

The publishing phase is the process by which original input files (e.g. ESRI Shapefiles or GeoJSON files) are transformed into a set of files that can be published to the Web and consumed by Quadstream clients. This is a one-time process for each shape set to be published.

The algorithms for the publishing phase do the following:

 1. Preprocess vertices - input polygons are assigned integer identifiers, and for each polygon, vertices are assigned integer identifiers that define their winding order for rendering. Vertices that fall on the same (x, y) coordinates are aggregated. The resulting data structure is a collection of vertex objects with the following properties:
   * (x,y) coordinates
   * memberships, a list of objects with
     * polygonId
     * vertexId
 2. Build the quadtree - each vertex is assigned to a node in the quadtree using a multi-scale variant of the Li-Openshaw algorithm. After this phase, a quadtree is available in which each occupied node contains a single vertex. This quadtree can be traversed to a limited depth to compute the Li-Openshaw generalization for a specified scale. The vertices in this quadtree can be inserted into a BLG-Tree in which their importance value corresponds to their level in the Quadtree.
 3. Partition into files - to partition the vertices into files, a transformation of the quadtree is computed in which the vertices are moved several levels up in the tree (and vertices at the root stay at the root). Let us call the number of levels vertices are moved up `fileDepth`. The effect of this transformation is that all the vertices present in the subtree`fileDepth` levels down from the root all end up in the root node, and subnodes contain the leaf nodes of their original subtree down `fileDepth` levels. Each node in the transformed tree is output as a file containing an array of vertex objects, named according to its (level, i, j) address in the tree. The value of `fileDepth` can be tweaked to optimize the size of the files for best performance.

The algorithm that computes the quadtree is the main novel contribution of this work, and can be summarized with the following pseudocode.

<pre style=""><code>N = makeHashMap()
for each vertex v in V
  for each level l in [0 ... L]
    k = key(v, l)
    if N does not contain k as a key
      put(N, k, v)
      break out of inner loop
</code></pre>

In this pseudocode,

 * N stands for "Nodes" of the quadtree,
 * V stands for the preprocessed "Vertices", and
 * L stands for the maximum "Level" for quad subdivision,
 * `makeHashMap()` creates a hash table, and
 * `key(vertex, level)` computes the address of the quadtree node at the given `level` that the given `vertex` falls into. This address is of the form (level, i, j) where i and j define the integral grid coordinates of the quadtree partitioning.

The running time of this algorithm is worst case O(n * L), because each vertex is visited once, and at most all levels between 0 and L are tested for each vertex. As L is a constant, the analysis simplifies to O(n).

### Consumption Phase
The consumption phase is the phase of the Quadstream system that executes when a Browser-residend Quadstream client reads the files created in the publishing phase from the server and presents an interactive map with zooming and panning to the end user.

In the client, an R-Tree is initialized that will contain the bounding rectangles of the polygons. Each polygon is represented in the client using a BLG-Tree. Initially, the root file is downloaded, which contains a coarse generalization of all polygons (and their bounding boxes, so the R-Tree can be initialized). As the user zooms and pans, the files containing the vertices that should be rendered for the changing view rectangle are downloaded and inserted into their corresponding BLG trees.

Our goal is to achieve a rendering cycle that can execute at 60 Frames per second to support smoothly animated zooming and panning. Each rendering cycle, the following steps occur:

 * The R-Tree is queried to find the list of polygons that are
   * partially or totally inside the viewing rectangle, and
   * large enough to see.
 * For each polygon in the resulting list, its corresponding BLG Tree is traversed to a limited depth to find the vertices that define the polygon at the appropriate scale defined by the viewing rectangle.
 * Each list of vertices is intersected with the viewing rectangle to eliminate vertices outside the viewing rectangle.
 * Some data value is looked up for each polygon, and
 * each polygon is rendered to the display using HTML5 Canvas.

### Issues

The above sections articulate the ideal implementation, however the actual implementation fails to address the following:

 * Partitioning across multiple files (the partitioning is computed, but in memory)
 * Use of an R-Tree to index polygons, and
 * View rectangle intersection computation.

The algorithm itself has two severe issues; it creates non-simple polygons in some cases, and it fails to handle the case when two polygons share a border but the vertices to not match up exactly.

<center>
<img width="300" src="../../figures/errorInVietnam2.png"></img> <img width="300" src="../../figures/errorInAfrica.png"></img>
</center>

<p class="caption">Examples of where the algorithm delivers poor results: non-simple polygons, and borders that do not match exactly.</p>

## Future Work

In terms of the implementation, future work includes using multiple files, using an R-Tree, and computing the intersection with the viewing rectnagle. Additional desired features include the ability to work over a hierarchy of polygons (e.g. Countries, States, Counties) and use of a 3D sphere projection.

This project is part of a larger project, the [Universal Data Cube Visualization System](http://universaldatacube.org/), which aims to provide a public resource pool with, Data Sets,  Visualization Authoring Tools, and Visualizations. This system uses Semantic Web standards such as the RDF Data Cube Vocabulary to represent data.

Future work includes integrating the Quadstream system with the UDC data representation system such that public data exposed using the UDC framework will be automatically made browsable using Quadstream-based choropleth maps. This involves the assignment of RDF URIs to Quadstream polygons as identifiers, and matching of identifers occuring in the UDC data with identifiers used for polygons.

Ideally a distributed Web-based ecosystem of developers and users can evolve in which users and developers publish their simplified polygons to the Web, and others can access them. Eventually, a system can evolve that contains all boundaries of Continents, Countries, States, Counties (and international equivalent), Cities, and Towns.

This hierarchy can serve as a backbone for assembling a collection of all useful public data, including statistics for health, economics, education, pollution, industry, and many more. The resulting tool would function as a telescope into the world through the lens of data and interactive graphics, and could be used by anyone with an Internet connection. It is our hope that this tool stands to revolutionize education, journalism, and public policy processes.

Links:

 * [Journal of Progress](http://universaldatacube.org/0.2/pages/quadstream_journal.html)
 * [Mid-project Presentation 1](http://universaldatacube.org/0.2/Quadstream/presentations/2012_11_14_Progress/)
 * [Mid-project Presentation 2](http://universaldatacube.org/0.2/Quadstream/presentations/2012_11_28_Progress/)
 * [Final Presentation](http://universaldatacube.org/0.2/Quadstream/presentations/2012_12_05_Final/)
 * [Pseudocode](http://universaldatacube.org/0.2/Quadstream/docs/pseudocode.html)
 * [Circle Generalization Demo with Addresses](http://universaldatacube.org/0.2/Quadstream/figures/circleGen/) ([source](https://github.com/curran/udcvis/tree/gh-pages/0.2/Quadstream/figures/circleGen/))
 * [Quadtree Subdivision Demo](http://universaldatacube.org/0.2/examples/quadSubdivision/app.html) ([source](https://github.com/curran/udcvis/tree/gh-pages/0.2/examples/quadSubdivision))
 * [Pan Zoom Demo with Test Data](http://universaldatacube.org/0.2/examples/panZoom/app.html) ([source](https://github.com/curran/udcvis/tree/gh-pages/0.2/examples/panZoom))
 * [World Map Demo](http://universaldatacube.org/0.2/examples/worldMap/app.html) ([source](https://github.com/curran/udcvis/tree/gh-pages/0.2/examples/worldMap), [documentation](http://universaldatacube.org/0.2/examples/worldMap/docs/app.html))
 * [3D Earth Demo](http://universaldatacube.org/0.2/examples/naturalEarthWebGLSphere/earth.html) ([source](https://github.com/curran/udcvis/tree/gh-pages/0.2/examples/naturalEarthWebGLSphere/head))
 * [Natural Earth](http://www.naturalearthdata.com/)
   * [Raster Data](http://www.naturalearthdata.com/downloads/50m-raster-data/50m-natural-earth-1/)
   * [Country Polygons](http://www.naturalearthdata.com/downloads/10m-cultural-vectors/)
     * Originally an [ESRI Shapefile](http://en.wikipedia.org/wiki/Shapefile)
     * Converted to [GeoJSON](http://en.wikipedia.org/wiki/GeoJSON) with [GDAL](http://www.gdal.org/)
       * [Resulting file](../../data/ne_10m_admin_0_countries.json) ~25MB.

# References

 * Li, Z. "Algorithmic Foundataion of Multi-Scale Spatial Representation". CRC Press. 2007.
 * Samet, S. "Foundations of Multidimensional and Metric Data Structures". Morgan Kaufmann Publishers. 2006.
 * Samet, S. "Applications of Spatial Data Structures". Addison Wessley Publishing. 1990.
 * Wikipedia: [R-Tree](http://en.wikipedia.org/wiki/R-tree) [Quadtree](http://en.wikipedia.org/wiki/Quadtree) [KD-Tree](http://en.wikipedia.org/wiki/K-d_tree) [Douglas-Peuker Algorithm](http://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm)
 * [Larger project: the UDCViS](http://universaldatacube.org/)
