package org.ivpr.udc.sql;

import java.util.Collection;

import org.ivpr.udc.core.DimensionInstance;
import org.ivpr.udc.core.Level;
import org.ivpr.udc.core.Record;

import com.hp.hpl.jena.rdf.model.Resource;

public class DimensionInstanceSQL extends UDCResourceSQL implements
		DimensionInstance {

	public DimensionInstanceSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
	}

	@Override
	public void delete() {
		// TODO Auto-generated method stub

	}

	@Override
	public void addRecord(Record record) {
		// TODO Auto-generated method stub

	}

	@Override
	public Level level() {
		String uri = resource.getProperty(UDC.hasLevel).getObject().asResource().getURI();
		return model.getLevel(uri);
	}

	@Override
	public Collection<Record> records() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void removeRecord(Record record) {
		// TODO Auto-generated method stub

	}

	@Override
	public void setLevel(Level level) {
		// TODO Auto-generated method stub

	}

}
