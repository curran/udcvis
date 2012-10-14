package org.ivpr.udc.sql;

import java.util.Collection;
import java.util.LinkedList;

import org.ivpr.udc.core.Level;
import org.ivpr.udc.core.Record;

import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;

public class RecordSQL extends UDCResourceSQL implements Record {

	public RecordSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
	}

	@Override
	public void delete() {
		// TODO Auto-generated method stub

	}

	@Override
	public void addParent(Record record) {
		Resource child = this.resource;
		Resource parent = model.jenaModel().createResource(record.uri());

		child.addProperty(UDC.hasParentRecord, parent);
		parent.addProperty(UDC.hasChildRecord, child);
	}
	@Override
	public Collection<Record> parents() {
		StmtIterator i = resource.listProperties(UDC.hasParentRecord);
		Collection<Record> parents = new LinkedList<Record>();
		for (; i.hasNext();) {
			Statement stmt = i.nextStatement();
			String uri = stmt.getObject().asResource().getURI();
			parents.add(model.getRecord(uri));
		}
		i.close();
		return parents;
	}
	
	@Override
	public void removeParent(Record parent) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Level level() {
		String uri = resource.getProperty(UDC.inLevel).getObject().asResource().getURI();
		return model.getLevel(uri);
	}



	@Override
	public void setNext(Record next) {
		resource.addProperty(UDC.hasNextRecord, model.jenaModel().createResource(next.uri()));
	}

	@Override
	public Record next() {
		return model.getRecord(resource.getProperty(UDC.hasNextRecord).getObject().asResource().getURI());
	}
}
