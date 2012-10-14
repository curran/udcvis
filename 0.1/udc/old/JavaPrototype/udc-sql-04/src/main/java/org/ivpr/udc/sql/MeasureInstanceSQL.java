package org.ivpr.udc.sql;

import org.ivpr.udc.core.Measure;
import org.ivpr.udc.core.MeasureInstance;
import org.ivpr.udc.core.Unit;

import com.hp.hpl.jena.rdf.model.Resource;

public class MeasureInstanceSQL extends UDCResourceSQL implements
		MeasureInstance {

	public MeasureInstanceSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void delete() {
		// TODO Auto-generated method stub

	}

	@Override
	public Measure measure() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Unit unit() {
		// TODO Auto-generated method stub
		return null;
	}

}
