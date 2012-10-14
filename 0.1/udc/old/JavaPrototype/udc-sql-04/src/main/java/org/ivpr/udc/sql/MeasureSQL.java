package org.ivpr.udc.sql;

import org.ivpr.udc.core.AggregationOperator;
import org.ivpr.udc.core.Measure;
import org.ivpr.udc.core.Quantity;

import com.hp.hpl.jena.rdf.model.Resource;

public class MeasureSQL extends UDCResourceSQL implements Measure {

	public MeasureSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
	}

	@Override
	public void delete() {
		// TODO Auto-generated method stub

	}

	public AggregationOperator aggregationOperator() {
		String uri = resource.getProperty(UDC.hasAggregationOperator).getObject().asResource().getURI();
		return model.getAggregationOperator(uri);
	}

	public Quantity quantity() {
		String uri = resource.getProperty(UDC.hasQuantity).getObject().asResource().getURI();
		return model.getQuantity(uri);
	}

}
