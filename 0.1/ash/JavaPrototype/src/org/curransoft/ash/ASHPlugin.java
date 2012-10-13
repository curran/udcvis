package org.curransoft.ash;

import java.util.Collection;

/**
 * The ASH plugin API. ASH plugins implement the factory pattern for certain
 * types of ASH resources.
 * 
 * @author curran
 * 
 */
public interface ASHPlugin {
	/**
	 * Creates an ASHResource with the given id.
	 * 
	 * @param type
	 *            the URI identifying the type of resource to be created by the
	 *            this plugin. This URI must be one of the URIs listed by
	 *            getResourceTypes(), and it must be subsequently returned by
	 *            the getType() method of the returned ASHResource. This
	 *            condition is checked and an InconsistentStateException is
	 *            thrown if the check fails.
	 * @param id
	 *            An id assigned to this resource by ASH. This number must be
	 *            returned by the getId() method of the returned ASHResource.
	 *            This condition is checked and an InconsistentStateException is
	 *            thrown if the check fails.
	 */
	public ASHResource createResource(String type, int id);

	/**
	 * Returns the list of URIs representing the various different types of
	 * ASHResources that this plugin is capable of creating.
	 */
	public Collection<String> getResourceTypes();
}
