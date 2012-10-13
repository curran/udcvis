package org.curransoft.ash;

/**
 * A convenience class implementing ASHResource with all methods unimplemented
 * except int id,String type.
 * 
 * @author curran
 * 
 */
public abstract class ASHResourceAdapter implements ASHResource {
	/**
	 * The id of this resource
	 */
	private final int id;
	/**
	 * The type of this resource
	 */
	private final String type;

	/**
	 * Create a new ash resource adapter with the given id and type. These are
	 * returned by getId() and getType() respectively.
	 */
	public ASHResourceAdapter(String type, int id) {
		this.id = id;
		this.type = type;
	}

	/**
	 * Returns the id passed into the constructor.
	 */
	public int getId() {
		return id;
	}

	/**
	 * Returns the type passed into the constructor.
	 */
	public String getType() {
		return type;
	}
}
