package org.ivpr.udc.sql;

import java.util.Collection;
import java.util.LinkedList;

import org.ivpr.udc.core.InternationalString;
import org.ivpr.udc.core.Level;
import org.ivpr.udc.core.LocalizedString;
import org.ivpr.udc.core.Record;

import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;
import com.hp.hpl.jena.vocabulary.RDF;

public class LevelSQL extends UDCResourceSQL implements Level {

	
	public LevelSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
	}

	@Override
	public Record createRecord(String uri) {
		Resource record = model.jenaModel().createResource(uri);
		record.addProperty(RDF.type, UDC.Record);

		Resource level = this.resource;
		level.addProperty(UDC.containsRecord, record);
		record.addProperty(UDC.inLevel, level);
		return new RecordSQL(record,model);
	}

	@Override
	public Collection<Record> listRecords(Level level) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setNamePlural(InternationalString namePlural) {
		resource.removeAll(LABEL.plural);
		for (LocalizedString s : namePlural.getLocalizedStrings())
			resource.addProperty(LABEL.plural, s.content, s.language);
	}

	@Override
	public InternationalString namePlural() {
		StmtIterator i = resource.listProperties(LABEL.plural);
		Collection<LocalizedString> localizedStrings = new LinkedList<LocalizedString>();
		for (; i.hasNext();) {
			Statement stmt = i.nextStatement();
			String language = stmt.getLanguage();
			String content = stmt.getString();
			localizedStrings.add(new LocalizedString(content, language));
		}
		i.close();
		return new InternationalString(localizedStrings);
	}

	@Override
	public Collection<Level> parents() {
		StmtIterator i = resource.listProperties(UDC.hasParentLevel);
		Collection<Level> parents = new LinkedList<Level>();
		for (; i.hasNext();) {
			Statement stmt = i.nextStatement();
			String uri = stmt.getObject().asResource().getURI();
			parents.add(model.getLevel(uri));
		}
		i.close();
		return parents;
	}

	public void addParent(Level level) {
		Resource child = this.resource;
		Resource parent = model.jenaModel().createResource(level.uri());

		child.addProperty(UDC.hasParentLevel, parent);
		parent.addProperty(UDC.hasChildLevel, child);
	}

	@Override
	public void removeParent(Level level) {
//		Resource child = this.resource;
//		Resource parent = model.jenaModel().createResource(level.uri());
//		
//		child.remProperty(UDC.hasParentLevel, parent);
//		parent.addProperty(UDC.hasChildLevel, child);
	}

	@Override
	public void delete() {
		// TODO Auto-generated method stub

	}
	
}
