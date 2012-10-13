package org.curransoft.ash;

import java.util.Collection;

/**
 * An ASH resource represents an entity in the ASHModel.
 * 
 * @author curran
 * 
 */
public interface ASHResource {
	/**
	 * Returns the id given to this resource at creation time (in
	 * ASHPlugin.createResource()).
	 */
	public int getId();

	/**
	 * Returns the type of this resource.
	 */
	public String getType();

	/**
	 * Sets the value of the specified property.
	 */
	void set(String property, String value);

	/**
	 * Removes the tracked value for the given property. After this call, the
	 * behavior of this property should be the same as it was before any call to
	 * set() on this property was made (i.e. use a default value).
	 */
	public void removeProperty(String property);

	/**
	 * Gets the value of the specified property.
	 * 
	 * @return
	 */
	String get(String property);

	/**
	 * Lists the property names for this resource which are currently set to
	 * something other than their default value.
	 */
	public Collection<String> listProperties();

	/**
	 * This is called by ASH when this resource is "uncreated" - permanently
	 * deleted (redo actually recreates an equivalent new resource later rather
	 * than reusing old ones) Completely destroy this resource - free all associated
	 * computational resources, don't worry about reconstruction at all.
	 */
	public void destroy();

	/**
	 * This is called by ASH when this resource is "deleted" - impermanently
	 * deleted (to support undo). Treat this as the destructor - destroy all
	 * significant computational resources owned by this resource, but retain
	 * enough information to be able to fully reconstruct this resource later in
	 * the resurrect() method.
	 */
	public void kill();

	/**
	 * Called after kill() in order to "undelete" this resource. After calling
	 * kill() and resurrect(), the behavior of this resource should be the same
	 * as it would have been had those functions not been called.
	 */
	public void resurrect();
}
