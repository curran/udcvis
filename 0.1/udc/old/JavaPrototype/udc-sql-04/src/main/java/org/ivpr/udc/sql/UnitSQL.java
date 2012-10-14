package org.ivpr.udc.sql;

import org.ivpr.udc.core.Quantity;
import org.ivpr.udc.core.Unit;

import com.hp.hpl.jena.rdf.model.Resource;

public class UnitSQL extends UDCResourceSQL implements Unit {

	public UnitSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
	}

	@Override
	public void delete() {
		// TODO Auto-generated method stub

	}

	@Override
	public Quantity quantity() {
		String uri = resource.getProperty(UDC.inQuantity).getObject().asResource().getURI();
		return model.getQuantity(uri);
	}

}
