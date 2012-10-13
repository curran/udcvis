package org.curransoft.ash;

import java.util.Stack;

/**
 * The ASH model is the fundamental runtime model for ASH applications. It
 * should not be manipulated directly, but instead should be manipulated only
 * indirectly by static invocations on the ASH class. It manages ASHResources,
 * which are manufactured by ASHPlugins. It should not be manipulated directly
 * because consistency with the session history graph must be maintained, which
 * is done by the ASH class, which provides the same functionality as this class
 * but adds support for session history recording and navigation.
 * 
 * @author curran
 * 
 */
public class ASHModel {
	/**
	 * The stack of resources in this model. The id of each resource is its
	 * index in this stack. Executing an AtomicActionCreate causes a new
	 * ASHResource to be created and pushed onto this stack. Executing an
	 * AtomicActionDelete causes the top ASHResource to be popped and destroyed.
	 */
	private final Stack<ASHResource> resources = new Stack<ASHResource>();

	/**
	 * The object responsible for looking up and loading ASH plugins at runtime.
	 */
	private final ASHPluginLoader pluginLoader;

	/**
	 * Creates a new ASHModel which will use the given plugin loader.
	 */
	public ASHModel(ASHPluginLoader pluginLoader) {
		this.pluginLoader = pluginLoader;
	}

	/**
	 * Creates a new resource of the given type and returns its id.
	 * 
	 * @param type
	 *            the URI identifying the type of resource to be created.
	 * @throws UnknownPluginTypeException
	 */
	public int create(String type) {
		// the id is the index in the stack of the new resource
		int id = resources.size();
		ASHPlugin plugin = pluginLoader.getPlugin(type);
		if (plugin == null)
			throw new UnknownPluginTypeException(type);
		ASHResource resource = plugin.createResource(type, id);
		if (resource == null)
			throw new UnknownPluginTypeException(type);
		validateTypeAndId(type, id, resource);

		resources.push(resource);
		return id;
	}

	/**
	 * Verifies that the given resource indeed has the given id and type. Throws
	 * an InconsistentStateException if they don't match.
	 */
	private void validateTypeAndId(String type, int id, ASHResource resource) {
		if (resource.getId() != id)
			throw new InconsistentStateException(
					"Mismatched ids! A resource of type "
							+ type
							+ " reported the incorrect id (not the one it was assigned).");
		if (resource.getType() != type)
			throw new InconsistentStateException(
					"Mismatched types! A reported the incorrect type (not the one it was assigned): expected "
							+ type + ", got " + resource.getType());
	}

	/**
	 * Undoes the previous create operation.
	 * 
	 * @param id
	 *            the id of the previously created resource (necessary for
	 *            consistency checking only).
	 */
	public void uncreate(int id) {
		if (id != resources.size() - 1)
			throw new InconsistentStateException(
					"Uncreation id is not that of the previously created resource! Got "
							+ id + ", expected " + (resources.size() - 1));
		else
			resources.pop().destroy();
	}

	/**
	 * Deletes a resource (can be undeleted later)
	 */
	public void delete(int id) {
		resources.get(id).kill();
	}

	/**
	 * Undeletes a resource which was previously deleted, with the given id.
	 */
	public void undelete(int id) {
		resources.get(id).resurrect();
	}

	/**
	 * Sets the given property on the ASH resource with the given id.
	 */
	public void set(int id, String property, String value) {
		resources.get(id).set(property, value);
	}

	/**
	 * Sets the given property of the given resource (id) to the given previous
	 * value. Value can be null, in this case the property is removed from the
	 * model, and it is assumed that the resource implementation uses some
	 * default.
	 */
	public void unset(int id, String property, String value) {
		if (value != null)
			resources.get(id).set(property, value);
		else
			resources.get(id).removeProperty(property);
	}

	/**
	 * Gets the id which will be assigned to the next resource created.
	 */
	public int getResourceIdCounterValue() {
		return resources.size();
	}

	/**
	 * Gets the value of the given property for the resource with the given id.
	 */
	public String get(int id, String property) {
		if (id >= resources.size())
			return null;
		else
			return resources.get(id).get(property);
	}
}
