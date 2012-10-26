# The Universal Data Cube Visualization System v0.1

This repository contains a collection of small programs that 
demonstrate specific concepts, technologies, or techniques for creating
interactive graphical applications using HTML5 and JavaScript. Here they are:

 * [Asynchronous Iteration](https://github.com/curran/udcvis/tree/gh-pages/0.1/asyncIteration) - experiments in scheduling using the JavaScript event loop.
   * [Iteration with Pauses](https://github.com/curran/udcvis/blob/gh-pages/0.1/asyncIteration/iterationWithPauses.js) - 
     Uses the JavaScript event loop for incremental iteration, implements a
     simple strategy for pausing and resuming execution.
   * [Simultaneous Iterators](https://github.com/curran/udcvis/blob/gh-pages/0.1/asyncIteration/simultaneousIterators.js) - 
     Illustrates the difference between a blocking synchronous iteration
     technique and an asynchronous iteration technique using the JavaScript
     event loop (via setTimeout).
 * [Concepts from Jaque Bertin](https://github.com/curran/udcvis/tree/gh-pages/0.1/bertin/markExperiments) -
   a prototype of a visualization API based on the concept of
   "marks" from the book "Semiology of Graphics" by Jaque Bertin.
   * [run it](http://curran.github.com/udcvis/0.1/bertin/markExperiments/index.html)
 * [Data](https://github.com/curran/udcvis/tree/gh-pages/0.1/data) - an example data set for use as the first data set imported into the
   * [UN Population Data](https://github.com/curran/udcvis/tree/gh-pages/0.1/udc/UN_Population) - 
   Encoded as RDF using the Data Cube Vocabulary.
 UDC system for use in testing and initial development.
 * [Grade Histogram](https://github.com/curran/udcvis/tree/gh-pages/0.1/gradeHistogram)
   * [run](http://curran.github.com/udcvis/0.1/gradeHistogram/index.html)
   * [annotated source code](http://curran.github.com/udcvis/0.1/gradeHistogram/docs/script.html)
 * [Hello CSS](https://github.com/curran/udcvis/tree/gh-pages/0.1/helloCSS) A
   CSS experiment for replicating the default typesetting style of LaTeX.
   * [view CSS example](http://curran.github.com/udcvis/0.1/helloCSS/)
   * [view LaTeX example](http://curran.github.com/udcvis/0.1/helloCSS/latexSample/document.pdf)
 * [Hello Express](https://github.com/curran/udcvis/tree/gh-pages/0.1/helloExpress) - 
   an example application that uses the Express Node.js Web Framework.
 * [Hello Require.js](https://github.com/curran/udcvis/tree/gh-pages/0.1/helloRequireJS) - 
   example project skeletons that uses the [Require.js](http://requirejs.org/)
   dependency management solution.
 * [Hello Socket.io](https://github.com/curran/udcvis/tree/gh-pages/0.1/helloSocketIO) - 
   an example Node.js server that uses the socket.io library for real-time communication.
 * [Hello Underscore.js](https://github.com/curran/udcvis/tree/gh-pages/0.1/helloUnderscore)
 - an example use of the Underscore functional programming
 library.
 * [Hello Web Audio API](https://github.com/curran/udcvis/tree/gh-pages/0.1/helloWebAudioAPI) - an example that uses the Web Audio API to generate
 sounds.
   * [run Magic Sequencer](http://curran.github.com/udcvis/0.1/helloWebAudioAPI/magicSequencer.html)
   * [run Random Notes](http://curran.github.com/udcvis/0.1/helloWebAudioAPI/randomNotes.html)
 * [Hello iPad](https://github.com/curran/udcvis/tree/gh-pages/0.1/helloiPad) - 
   an example graphical application that harnesses the multi-touch events 
   provided by Mobile Safari on the iPad (and iPhone).
 * iPadDrum - an unfinished implementaion of a rhythmic musical instrument
 for the iPad. The architecture is that a server is running that relays
 information from the iPad (where interaction takes place) to a Web page
 (where audio generation takes place).
   * [in GitHub](https://github.com/curran/udcvis/tree/gh-pages/0.1/iPadDrum)
 * [In-memory RDF Store](https://github.com/curran/udcvis/tree/gh-pages/0.1/inMemoryRDFStore) - a prototype implementation of an idea for an efficient
 in-memory RDF store.
 * [Liquid Globe 2010](https://github.com/curran/udcvis/tree/gh-pages/0.1/liquidGlobe2010) - a collection of code examples from 2010
   * [run 2D Pan and Zoom Example](http://curran.github.com/udcvis/0.1/liquidGlobe2010/liquid-globe-01/2010_11_20_2d_pan_zoom.html)
   * [run Sliders Example](http://curran.github.com/udcvis/0.1/liquidGlobe2010/liquid-globe-02/2010_11_23_Sliders.html)
   * [run Velocity Sliders](http://curran.github.com/udcvis/0.1/liquidGlobe2010/liquid-globe-02/2010_11_27_Sliders_parameterized.html)
   * [run tick marks example](http://curran.github.com/udcvis/0.1/liquidGlobe2010/liquid-globe-02/2010_11_27_tickMarks.html)
 * [Painters](https://github.com/curran/udcvis/tree/gh-pages/0.1/painters) - 
   an experiment in using the JavaScript event loop in conjunction with
   requestAnimationFrame for scheduling incremental execution of algorithms
   that mutate a raster buffer. It turns out that it is possible to draw
   2000 colored squares per 25 milliseconds, interleaved with flushing the 
   offscreen buffer to the display. This way of scheduling seems to retain
   a refresh rate of about 30 FPS while performing this incremental drawing.
   * [run](http://curran.github.com/udcvis/0.1/painters/index.html) (open the
     console to see performance measurements)
 * [Parametric Line](https://github.com/curran/udcvis/tree/gh-pages/0.1/parametricLine) - 
   an educational tool illustrating a parametric line segment equation.
   * [run it](http://curran.github.com/udcvis/0.1/parametricLine/)
   * [annotated source](http://curran.github.com/udcvis/0.1/parametricLine/docs/all-modules.html)
 * pointEditor - a simple graphical editor for 2D point sets
   * [in GitHub](https://github.com/curran/udcvis/tree/gh-pages/0.1/pointEditor)
   * [annotated source code](http://curran.github.com/udcvis/0.1/pointEditor/docs/all-modules.html)
   * [run Point Editor](http://curran.github.com/udcvis/0.1/pointEditor/)
 * polygonEditor - a graphical editor for polygons that generates output
 compatible with the CGAL computational geometry project.
   * [in GitHub](https://github.com/curran/udcvis/tree/gh-pages/0.1/polygonEditor)
   * [annotated source code](http://curran.github.com/udcvis/0.1/polygonEditor/docs/all-modules.html)
   * [run Polygon Editor](http://curran.github.com/udcvis/0.1/polygonEditor/)
 * quadstream2010 - a collection of Java and JavaScript code from 2010 that
 implements a prototype of the "Quadstream" algorithm for supporting 
 multi-scale geographic maps rendered on the Web.
   * [in GitHub](https://github.com/curran/udcvis/tree/gh-pages/0.1/quadstream2010)
   * [run R-Tree Example](http://curran.github.com/udcvis/0.1/quadstream2010/Quadstream00/src/main/webapp/tests/rtree/rtreeTest.html)
   * [run Rectangle Intersection Test](http://curran.github.com/udcvis/0.1/quadstream2010/Quadstream00/src/main/webapp/tests/rtree/rectangleTests.html)
   * [run BLG-Tree Example](http://curran.github.com/udcvis/0.1/quadstream2010/Quadstream00/src/main/webapp/tests/blgtree/BLGTreeTest.html)
 * [Resize Canvas](https://github.com/curran/udcvis/tree/gh-pages/0.1/resizeCanvas) Dynamically make the canvas full screen.
