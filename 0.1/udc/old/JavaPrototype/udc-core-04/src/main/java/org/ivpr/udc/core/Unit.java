package org.ivpr.udc.core;

/**
 * A unit is a concrete realization of a quantity. Example units include US
 * Dollars, Count of People, Kilograms, and Kilometers per Hour.
 * 
 * 
 * @author curran
 * 
 */
public interface Unit extends UDCResource {
	/**
	 * Gets the quantity represented by this unit.
	 */
	public Quantity quantity();
}
