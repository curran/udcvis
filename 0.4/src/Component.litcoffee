The `Component` class is the base class of graphical components that
are drawn on the screen and support user interaction.
    define ['backbone', 'underscore'], (Backbone, _) ->
      class Component
        constructor: -> _.extend(@, Backbone.Events)
