package org.ivpr.udc.sql;

import java.util.Collection;

import org.ivpr.udc.core.InternationalString;
import org.ivpr.udc.core.Quantity;
import org.ivpr.udc.core.Unit;

import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.vocabulary.RDF;

public class QuantitySQL extends UDCResourceSQL implements Quantity {

	public QuantitySQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
	}

	public void delete() {
		// TODO Auto-generated method stub

	}

	@Override
	public Unit createUnit(String uri, InternationalString name) {
		Resource unit = model.jenaModel().createResource(uri);
		unit.addProperty(RDF.type, UDC.Unit);
		Resource quantity = this.resource;
		quantity.addProperty(UDC.containsUnit, unit);
		unit.addProperty(UDC.inQuantity, quantity);
		UnitSQL unitSQL = new UnitSQL(unit,model);
		unitSQL.setName(name);
		return unitSQL;
	}

	@Override
	public Collection<Unit> listUnits() {
		// TODO Auto-generated method stub
		return null;
	}

}
