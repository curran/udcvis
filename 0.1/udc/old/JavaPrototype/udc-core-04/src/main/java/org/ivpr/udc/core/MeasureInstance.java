package org.ivpr.udc.core;

/**
 * A (measure, unit) pair.
 * 
 * @author curran
 * 
 */
public interface MeasureInstance {
	/**
	 * Gets the globally unique URI for this measure instance.
	 */
	public String uri();

	/**
	 * The measure represented by this measure instance.
	 */
	public Measure measure();

	/**
	 * The unit of this measure instance.
	 */
	public Unit unit();
}
