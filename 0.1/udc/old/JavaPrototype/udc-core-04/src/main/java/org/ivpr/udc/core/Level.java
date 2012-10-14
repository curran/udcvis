package org.ivpr.udc.core;

import java.util.Collection;

/**
 * A level represents a class of records which are on the same level in a record
 * hierarchy. Example levels include "Year", "Country", "Industry Sector" and
 * "Iris". Levels can be hierarchical. Each level may have a parent level. For
 * example, the parent record of the level "US state" may be the level
 * "Country". For a given level, the levels which have it as a parent are
 * considered its child levels. A level tree represents a record topology. A
 * path from the root to a leaf of a level tree (or any subpath thereof)
 * represents a record hierarchy.
 * 
 * 
 * @author curran
 * 
 */
public interface Level extends UDCResource {
	/**
	 * Gets the human readable name for this level (plural). For example,
	 * "Years"
	 */
	public InternationalString namePlural();

	/**
	 * Sets the human readable name for this level (plural).
	 */
	public void setNamePlural(InternationalString namePlural);

	/**
	 * Gets all parent levels of this level (the transitive closure of the
	 * 'direct parent' relation). A level 'a' is considered a parent of level
	 * 'b' if records of level 'b' may be contained within records of level 'a'.
	 * The parent-child relationship of levels may span different dimensions.
	 * For example, the space level "US County" is a parent of industry category
	 * level "Establishment", because "Establishments" are have geographic
	 * location and fall within geographic regions.
	 */
	public Collection<Level> parents();

	/**
	 * Adds a parent level to this level. A level 'a' is a parent of level 'b'
	 * when records of level 'b' may be contained within records of level 'a'.
	 */
	public void addParent(Level level);

	/**
	 * Removes a parent level from this level.
	 */
	public void removeParent(Level level);

	/**
	 * Creates a new record object and places it in this level.
	 */
	public Record createRecord(String uri);

	/**
	 * Returns the collection of records which are in the given level.
	 */
	public Collection<Record> listRecords(Level level);
}
