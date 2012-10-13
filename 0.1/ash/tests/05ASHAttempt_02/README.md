# ASH
## Public API
On the exported global variable ASH, there are the following methods:
### registerPlugin(plugin)
Args:

- `plugin` An object expected to contain the following members:
    - `type` A string Id of the resource type provided by this plugin.
    - `create(resourceId)` A factory method for creating resource instances. This function takes one argument, the Id of the resource being created. This function should have a side effect of creating a resource managed by the plugin, and should also return an object containing the following members:
        - `set(property,value)` Sets the given property to the given value on this resource.
        - `unset(property)` Unsets the given property on this resource.
    - `delete(resourceId)` A method for deleting previously created resources (really deleting, i.e. freeing memory).

### genResourceId()
Generates and returns a unique (string) resource Id.

### set(resource,property,value)
Args:
 - `resource` A string resource Id
 - `property` A string property Id.
 - `value` A string value.

If `property` is `ASH.TYPE`, then `value` is interpreted to be a type Id (as defined as `plugin.type` in a previous call to `registerPlugin(plugin)`), and setting this property causes ASH to invoke `plugin.create(resourceId)` on the plugin corresponding to the type.

If `property` is not `ASH.TYPE`, it is assumed that the property `ASH.TYPE` has been previously set, and ASH will set the property on the existing resource (meaning it will call `set()` on the object returned previously from `plugin.create()`).

### unset(resource,property)
Args:
 - `resource` A string resource Id
 - `property` A string property Id.

If `property` is `ASH.TYPE`, then unsetting this property causes ASH to invoke `plugin.delete(resourceId)` on the plugin corresponding to the type of `resource`, deleting the resource.

If `property` is not `ASH.TYPE`, ASH will unset the property on the resource (meaning it will call `unset()` on the object returned previously from `plugin.create()`).

### TYPE
The property ID used for the type property.

## Private API
Documentation and explaination of the inner workings of ASH.
### Private variables in the ASH singleton:
 - `resourceIdCounter` A counter used by `genResourceId()`
 - `plugins` The plugins registered with ASH. A map where keys are resource Ids (strings) and values are the objects passed into `registerPlugin(plugin)`
 - `resourceTypes` A resource type lookup table, can answer 'Which type is resource X?'. A map where keys are resource Ids (strings) and values are resource type Ids (strings).
 - `resources` The resources in the current ASH state.
 - 
### Concepts
 - "The ASH State" or a given ASH singleton at runtime is the current state of that ASH singleton, defined by what sequence of atomic actions have been performed.
