package org.ivpr.udc.core;

import java.util.Collection;


/**
 * A quantity is a kind of numeric property. Example quantities include
 * Currency, Quantity of People, Mass, and Speed.
 * 
 * @author curran
 * 
 */
public interface Quantity extends UDCResource {
	/**
	 * Creates a new unit with the given URI which represents this quantity.
	 */
	public Unit createUnit(String uri, InternationalString name);
	
	/**
	 * Lists all units which represent this quantity.
	 */
	public Collection<Unit> listUnits();
}
