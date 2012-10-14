package org.ivpr.udc.sql;

import org.ivpr.udc.core.AggregationOperator;

import com.hp.hpl.jena.rdf.model.Resource;

public class AggregationOperatorSQL extends UDCResourceSQL implements
		AggregationOperator {

	public AggregationOperatorSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
	}

	@Override
	public void delete() {
		// TODO Auto-generated method stub

	}

}
