/* 9/17/2011 Curran Kelleher
 * A first attempt at implementing the ASH architecture idea in Javascript.
 *
 * The API:
 * The concept is that there is a singleton ASH application state model
 * which manages a versioned data structure which can be thought of as:
 * Map<String,<Map<String,String>> model; (in Java syntax)
 *       |           |       |
 *    resource   property  value
 *
 * This model is kind of like the RDF data model.
 *
 * Changes to such a model can be encapsulated two types of short commands:
 * - s foo bar baz <-- model.get("foo").put("bar","baz")
 *                      e.g. set foo.bar = baz where
 *                      - foo is a resource
 *                      - bar is a property
 *                      - baz is a value
 * - us foo bar <-- model.get("foo").remove("bar")
 *                      e.g. set foo.bar = null, remove the property entirely.
 *                      - foo is a resource
 *                      - bar is a property
 *
 * The software architecture concept based around this ASH model is as follows:
 * - There is a special property, "type", which gets special treatment.
 *
 *   Whenever the property "type" is set on a resource with a particular value,
 *   for example "s circle1 type circle"
 *     (resource="circle1", property="type", value="circle")
 *   , then the value is used to look up a resource factory from a set of
 *   registered ASH plugins. If the value ("circle" in this case) is found
 *   as a resource type provided by a plugin, that plugin is invoked to
 *   create an instance of that resource type in memory, and also possibly
 *   will call some other initialization code for dealing with "circle"s.
 *
 *   Whenever the property "type" is unset on a resource,
 *   e.g. "us circle1 type"
 *     (resource="circle1", property="type")
 *   , then the resource instance created earlier by the ASH plugin providing
 *   the "circle" type is destroyed and its memory freed.
 *
 *   A contract which must be followed in order for undo and redo to work
 *   properly is that before calling unset on the type property, all other
 *   properties must first be unset as well. This contract is enforced, and
 *   the code will break if application code attemps to violate this contract.
 *
 * - Manipulation of other properties besides "type" are recorded by the ASH
 *   runtime and managed by it (for synchronization and undo/redo), but the
 *   actual handling of those manupulations (the side effects of changing the
 *   GUI, performing some query, etc.) is delegated to the resource instances
 *   created by the ASH plugins. For example, "s circle1 x 100" will set the 
 *   property "x" of the resource called "circle1" to the value "100". That fact
 *   will be recorded by the ASH runtime and perhaps broadcast to other clients
 *   in a shared session, but the resource implementation will also get the 
 *   message, and can act on it by, for example, setting the graphics buffer
 *   dirty flag to true so that the circle will redraw at that moment with its
 *   new position.
 *
 *   Here is some example initialization code for defining and registering 
 *   an ASH plugin for the example "Circle" type:
 *
 *   var defaultX = 0, defaultY = 0; //defaults for new circles
 *   var graphicsDirty = true;
 *   var circles = {}; //the list of circle objects managed by the plugin
 *   // registerPlugin(<resource type>,<create function>,<delete function>)
 *   ASH.registerPlugin('Circle',
 *     // the function that creates a resource,
 *     // called when the 'type' property is set.
 *     {create: function(resourceID){
 *       circles[resourceId] = {x:defaultX,y:defaultY};
 *       return {
 *         //the function that sets a value on a 'circle'
 *         set:function(property,value){
 *           //assuming 'property' == 'x' or 'y'
 *           circles[resourceId][property] = value;
 *           graphicsDirty = true;
 *         },
 *         //the function that sets a value on a 'circle'
 *         unset:function(property){
 *           //assuming 'property' == 'x' or 'y'
 *           var defaultValue = property=='x'?defaultX:defaultY;
 *           circles[resourceId][property] = defaultValue;
 *           graphicsDirty = true;
 *         }
 *       };
 *     },
 *     // the function that deletes a resource,
 *     // called when the 'type' property is unset.
 *     delete:function(resourceID){
 *       circles[resourceId] = undefined;
 *       graphicsDirty = true;
 *     }});
 *
 *   Say the application creates a circle when you click on empty space,
 *   lets you drag existing circles, and deletes a circle when it is 
 *   clicked on. Here is some example code for doing that:
 *
 *     function mouseClicked(mouseX, mouseY){
 *       var circle = getCircleUnderPoint(mouseX,mouseY);
 *       if(circleUnderMouse == undefined){
 *         var circleID = ASH.genID();
 *         //create the circle
 *         ASH.set(circleID,'type','Circle');
 *         //move the circle to be under the mouse
 *         ASH.set(circleID, 'x', mouseX);
 *         ASH.set(circleID, 'y', mouseY);
 *       }
 *       else{
 *         //delete the circle
 *         ASH.unset(circleID, 'x');
 *         ASH.unset(circleID, 'y');
 *         ASH.unset(circleID, 'type');
 *       }
 *     }
 *
 *   Notice that the key to the success of ASH is that ALL changes to
 *   the application state model MUST go through the ASH API. This is the
 *   key aspect that enables synchronous collaborative sessions as well as
 *   infinite undo/redo and arbitrary session history graph navigation.
 *   The whole reason for using ASH is to get these features, and for them
 *   to work properly, the application and plugin code must manipulate its
 *   entire application model through the ASH API, and follow all contracts
 *   (e.g. all other properties must be unset before 'type' is unset).
 *   There is the issue of setting two or more properties atomically to
 *   consider. For example, one would not want to first update the X
 *   coordinate, have the circle redraw with the new X and the old Y, then
 *   update the Y coordinate and have the circle redrawn again. In
 *   multithreaded environments, this is where the concept of a transaction
 *   would come into play, but since Javascript has a single threaded execution
 *   model, we don't need to worry about it - we are guaranteed that no
 *   other code will be run between two consecutive calls. This means that 
 *   mouse listener code for moving a "circle" may look something like this:
 *
 *     function mouseDragged(mouseX, mouseY){
 *       ASH.set(circleBeingMoved.id, "x", mouseX);
 *       ASH.set(circleBeingMoved.id, "y", mouseY);
 *     }
 *
 *   In this example code, X and Y are set "at the same time", meaning that
 *   the circle will not ever be drawn in some intermediate state. When
 *   ASH.set() is called, the set function of the resource created by the
 *   plugin is called too, causing the graphicsDirty flag to be set twice
 *   to true, but then the graphics need only redraw once to update from the
 *   change.
 */
 var ASH = {
   /**
    * The registered ASH plugins. Each plugin is a factory for
    * resources of a certain type.
    * Keys are resource type strings.
    * Values are resource factories (plugins).
    *
    * Do not access this directly from external code.
    */
   _plugins : {};
   
   /**
    * The resource instances created by plugins.
    * Keys are resource id strings,
    * Values are resource instances created by plugins.
    *
    * Do not access this directly from external code.
    */
   _resources : {};
   
   /**
    * Registers an ASH plugin with the ASH runtime. An ASH plugin is
    * responsible for managing creation and deletion of mutable resources
    * of a certain type. Arguments:
    *  resourceType - a string identifying the type of resource managed by
    *    this plugin.
    *  plugin - an object with the following properties:
    *    create - a function which creates resource instances. 
    *      This function should return an object with the following properties:
    *        set(property, value) - a function that handles the setting of
    *          the given property to the given value
    *        unset(property) - a function that handles the unsetting of
    *          the given property.
    *    delete - a function which deletes resources instances.
    *      This function is just responsible for cleaning up after any
    *      side effects caused previously by the creation of the resource
    *      being deleted.
    */
   registerPlugin : function(resourceType, plugin){
     _plugins[resourceType] = plugin;
   },
   
   /**
    * Sets the value of the given property of the given resource in the ASH
    * application state model to the given property. All arguments are strings.
    *
    * You can think of the application state model as follows:
    * Map<String,<Map<String,String>> model; (in Java syntax)
    *     |           |       |
    *  resource   property  value
    *
    * This model is kind of like the RDF data model.
    *
    * Execution of this 'set()' function conceptually performs the following:
    *  model.get(resource).put(property,value);
    * or, you can think of it as
    *  resource[property] = value;
    */ 
   set: function (resource, property, value){
     //if property is 'type', create the resource
     if(property = 'type'){
       //TODO finish this code
     }
     //if property is not 'type', set the property of the existing resource
     else{
     }
   }
};
   
