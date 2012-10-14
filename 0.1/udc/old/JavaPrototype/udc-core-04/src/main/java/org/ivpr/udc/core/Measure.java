package org.ivpr.udc.core;

/**
 * A measure is a numeric property of records or products thereof, defined by a
 * quantity and an aggregation operator. Here are some example measures, shown
 * in the form: "measure name", "quantity", "aggregation operator": <br>
 * "Average Income", "Currency", "Average" <br>
 * "Population", "Quantity of People", "Sum" <br>
 * "Employment", "Quantity of People", "Sum" <br>
 * "Average Speed Limit", "Speed", "Average"
 * 
 * @author curran
 * 
 */
public interface Measure extends UDCResource {
	/**
	 * Gets the quantity associated with this measure.
	 */
	public Quantity quantity();

	/**
	 * Gets the aggregation operator associated with this measure.
	 */
	public AggregationOperator aggregationOperator();
}