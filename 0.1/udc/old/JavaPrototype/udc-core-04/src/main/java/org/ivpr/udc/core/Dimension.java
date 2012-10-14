package org.ivpr.udc.core;

import java.util.Collection;

/**
 * A dimension represents a set of levels which could all potentially belong to
 * the same level tree, and the record topology represented by these levels.
 * Example dimensions include "Time", "Space", "Industry" and "Iris Category".
 * All records are contained within levels, and all levels are contained within
 * dimensions.
 * 
 * @author curran
 */
public interface Dimension extends DCResource {
	/**
	 * Creates a new level with the given URI and names and adds it to this
	 * dimension.
	 * 
	 * @param name
	 *            The singular name for the new level
	 * @param namePlural
	 *            The plural name for the new level
	 */
	public Level createLevel(String uri, InternationalString name, InternationalString namePlural);

	/**
	 * Lists all levels in this dimension.
	 */
	public Collection<Level> listLevels();

}
