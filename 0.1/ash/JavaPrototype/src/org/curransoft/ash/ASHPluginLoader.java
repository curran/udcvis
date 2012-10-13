package org.curransoft.ash;


/**
 * The class responsible for locating and loading ASH plugins. An
 * ASHPluginLoader implements the factory pattern for ASH plugins.
 * 
 * @author curran
 * 
 */
public interface ASHPluginLoader {
	/**
	 * Looks up, loads, and returns a runtime instance of the ASH plugin which
	 * is responsible for creating resources of the given type. Calling this
	 * method with two different type URIs implemented by the same plugin will
	 * result in the same instance of that plugin being returned by both calls.
	 * 
	 * @param type
	 *            the URI identifying the type of resource created by the
	 *            desired plugin.
	 * @return a runtime instance of the resource factory implementation
	 *         corresponding to the given resource type IRI.
	 * @throws UnknownPluginTypeException
	 *             thrown if the type cannot be resolved.
	 */
	ASHPlugin getPlugin(String type);
}
