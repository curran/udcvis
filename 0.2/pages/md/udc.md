The purpose of the UDC is to provide a data source for:

 * Thematic Maps
 * Scatter Plots
 * Bar Charts
 * Pie Charts
 * Tree Maps
 * Line Charts
 * Area Charts
 * Heat Maps
 * Table Views

Common to all of these visualization techniques is the following:

 * Selection of members within a dimension
   * Potentially based on levels
 * Selection of measures
 * Selection of data sets and combinations thereof

The UDC client can consume data from multiple sources. The view of the UDC that one gets is determined by the set of data sources used.

To get the project started, a set of "dummy" dimensions has been created as follows:
<div id="udcDataView"></div>
<script src="requireJSConfig.js"> </script>
<script src="../lib/require-jquery.js"></script>
<script src="populateUDCDataView.js">
</script>

The list above is [dynamically generated](https://github.com/curran/udcvis/blob/gh-pages/0.2/pages/populateUDCDataView.js) from RDF data conforming to the following guidelines:

 * Instances of
   * Dimension
   * Level
   * Member
   * Measure
 * have values for the following properties:
   * `rdf:type` declaring the type of the resource
   * `rdfs:label` A human-readable name
 
 * Instances of Dimension have values for
   * At least one of the following
     * "orderingLists" A set of ordered lists containing
       the URIs of all members belonging to 
       this dimension. These lists define the ordering
       of members that are sibling nodes in the dimension hierarchy.
     * "orderingFunction" A string literal that contains a JavaScript
       function `compare(a, b)` that takes as input two Members that 
       are sibling nodes in the dimension hierarchy tree.
 * Instances of Level have values for
   * "inDimension"
   * "parentLevel" (optional)
 * Instances of Member have values for
   * At least one of the following:
     * "inDimension" indicating the dimension to which
       this Member belongs
     * "inLevel" The level this member is a part of
       * From this, the would-be value of "inDimension"
         could be inferred.
   * "parentMember" (optional) The member for which this member is a
     child in the dimension hierarchy

In the UDC client, an API is provided that provides

 * `udc.maximalElements(callback(members))` Asynchronously calls 
   `callback` passing `members`, an array of ids for Member
   instances that are the [maximal elements](http://en.wikipedia.org/wiki/Partially_ordered_set#Extrema)
   of the [partially ordered set](http://en.wikipedia.org/wiki/Partially_ordered_set)
   defined by the dimension hierarchy. These are, so to speak, the
   "root nodes" of the dimension hierarchy. If the dimension hierarchy
   is a tree with a single root, `(members.length == 1) == true`.


