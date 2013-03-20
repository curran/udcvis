define ['backbone', 'underscore'], (Backbone, _) ->
  class Component
    constructor: -> _.extend(@, Backbone.Events)
