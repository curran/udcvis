package org.ivpr.udc.core;

import java.util.Collection;

/**
 * A record represents a region of time, a region of space, an object category
 * or an individual object. Example records include the year "1990" (a region of
 * time), the country "USA" (a region of space), the industry sector "Mining"
 * (an object category), and the iris flower with id "25" (an individual
 * object). Records can be hierarchical. Each record may have a parent record.
 * For example, the parent record of the US state "Massachusetts" may be the
 * country "USA". For a given record, the records which have it as a parent are
 * considered its child records.
 * 
 * Each record can have more than one parent. Therefore the structure of record
 * relationships is not limited to a hierarchy (tree), but in general is a
 * topology (graph). A record "a" is considered a parent of another record "b"
 * if and only if the region, category or individual represented by "b" is fully
 * contained within that represented by "a". Many record hierarchies
 * (containment trees) can be expressed within a single record topology
 * (containment graph).
 * 
 * A record product can be defined for regional or categorical records, which
 * represents a composite region. For example, the product of the country "USA"
 * and the year "1990" defines simultaneously a region of time and space, namely
 * "The USA in the year 1990".
 * 
 * @author curran
 * 
 */
public interface Record extends UDCResource {
	/**
	 * Gets the parent records of this record (the transitive closure of the
	 * "direct parent" relation). The parent-child relationship of records is
	 * determined by containment. Therefore this function should return the
	 * collection of records which fully contain this one. Parent records may be
	 * from different dimensions. For example, the record "Massachusetts, USA"
	 * of the space dimension is a parent record of the establishment
	 * "Harvard University" of the industry category dimension, because
	 * "Harvard University" is located within "Massachusetts, USA".
	 */
	public Collection<Record> parents();

	/**
	 * Adds a parent record to this record. A record 'a' is a parent of record
	 * 'b' when 'b' is fully contained within 'a'.
	 */
	public void addParent(Record parent);

	/**
	 * Removes the given parent record from this record.
	 */
	public void removeParent(Record parent);

	/**
	 * Gets the record which is logically the record that follows this one, on
	 * the same level. For example year1990.next() -> year1991.
	 */
	public Record next();

	/**
	 * Sets the record which is logically the record that follows this one.
	 */
	public void setNext(Record next);

	/**
	 * Returns the level to which this record belongs.
	 */
	public Level level();

}
