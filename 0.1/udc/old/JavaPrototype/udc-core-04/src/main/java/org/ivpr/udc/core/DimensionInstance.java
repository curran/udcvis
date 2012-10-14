package org.ivpr.udc.core;

import java.util.Collection;

/**
 * A dimension instance is a specific subset of records from one level of a
 * dimension.
 * 
 * @author curran
 * 
 */
public interface DimensionInstance {
	/**
	 * Gets the globally unique URI for this dimension instance.
	 */
	public String uri();

	/**
	 * Gets the level represented by this dimension instance.
	 */
	public Level level();

	/**
	 * Sets the level represented by this level instance.
	 */
	public void setLevel(Level level);

	/**
	 * Gets the records within this dimension instance.
	 */
	public Collection<Record> records();

	/**
	 * Adds the given record to this dimension instance.
	 */
	public void addRecord(Record record);

	/**
	 * Removes the given record from this dimension instance.
	 */
	public void removeRecord(Record record);

}
