define ['Backbone'], (Backbone) ->
  class Component
    constructor: -> _.extend(@, Backbone.Events);
