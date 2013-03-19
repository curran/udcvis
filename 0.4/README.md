# The Universal Data Cube Visualization System v0.4

## Design and Philosophy
So far the UDCViS has been a collection of random tests and modules, but the modules have not really come together to create interactive visualizations yet.

I often have wished for a more expressive language than JavaScript for implementing the features I have in mind, so this time around I will use CoffeeScript for defining modules. The class model of CoffeeScript and its accompanying syntax are very elegant and straightforward. Though classical inheritance in JavaScript is a subject of much debate, and some feel the notion of a class should disappear, I find the class-based inheritance model particurly well suited to modeling software systems for visualization and graphics (e.g. a nested component model).

Throughout the process so far, the Underscore library has been a great companion, providing functional programming utilities galore. To make the code as expressive as possible, I will explore the idea of polluting the global namespace with all the Underscore methods (this can be done with `_.extend(window,_);`). This way, primitives like `map` and `extend` will look like they are part of the language. As an example, which of the following would you prefer to see in your code?

 * `_.map(arr, function(x){ return x*x });`
 * `map(arr, (x) -> x * x)`

I have been struggling to find a reasonable system for documenting source code. I have tried docco and YUIDoc so far. With CoffeeScript, there is an interesting direction of code and documentation style called [literate CoffeeScript](http://coffeescript.org/#literate), where the source code is written like prose, with prose interspersed with code. The advantages of this approach over the others I have tried are:

 * These documents integrate very well with GitHub, as they are valid Markdown
 * There are not two different places to look for documentation vs. source code.

Require.js has been a faithful dependency management framework, and is compatible with CoffeeScript. Backbone has been immensely useful for handling events.

In summary, version 0.4 of the UDCViS will be built with the following tools and principles:

 * Literate CoffeeScript
 * Underscore
 * Backbone
 * Require.js

The following modules have been implemented:

 * `Point` (x, y)
 * `Rectangle` (x, y, w, h)
   * (x1, y1, x2, y2) made available as setters and getters
 * `Viewport` (source `Rectangle`, destination `Rectangle`)
   * Transforms points from the source to the destination
   * Transforms points from the destination to the source

The following modules are planned:

 * `Marks` An API for defining visualization primitives based on concepts from Jaque Bertin (book: Semiology of Graphics)
 * `RTree` A spatial index for rectangles.
 * `Component` A base class for graphical coomponents.
       * Offscreen buffering for each child
 * `Container` (extends `Component`) A component that has child components.
   * Uses Backbone for event propagation.
   * Supports offscreen buffering of children.
 * `LinearContainer` (extends `Container`) A box model for defining tiled layouts that supports:
   * Vertical and horizontal boxes that layout children linearly
   * Each child has a `size` that determines its relative size
 * `LayerContainer` (extends `Container`) A container for layers that supports:
   * Absolute positioning of layers
   * Panning and zooming
 * `MarkSet` (extends `Component`) A set of interactive visual marks
   * For use with the `Marks` module.
   * Implements selection and probing interactions.
 * `Normalization` A mapping between data values and the range [0,1].
   * Types: linear, log, square root
 * `ColorMap` A mapping from the range [0,1] to colors.
 * `NiceNumbers` A function that generates nice numbers for use in defining tick marks and binning definitions.
 * `Quadstream` A library for rendering multi-scale choropleth maps.
