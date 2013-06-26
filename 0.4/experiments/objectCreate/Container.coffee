define ['Component', 'underscore'], (Component, _) ->
  methods =
    addChild: (component, options) ->
      child =
        component: component
        options: options
        listener: => @trigger 'graphicsDirty'
      child.component.on 'graphicsDirty', child.listener
      @children.push child
      @trigger 'graphicsDirty'
    removeChild: (component) ->
      child = _(@children).findWhere {component: component}
      child.component.off 'graphicsDirty', child.listener
      @children = _(@children).without child
      @trigger 'graphicsDirty'
  create: ->
    Object.create _(Component.create()).extend methods,
      children: value: []
