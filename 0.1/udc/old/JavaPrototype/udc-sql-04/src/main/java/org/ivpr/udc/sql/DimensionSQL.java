package org.ivpr.udc.sql;

import java.util.Collection;

import org.ivpr.udc.core.Dimension;
import org.ivpr.udc.core.InternationalString;
import org.ivpr.udc.core.Level;

import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.vocabulary.RDF;

public class DimensionSQL extends DCResourceSQL implements Dimension {
	public DimensionSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
	}

	public Level createLevel(String uri,InternationalString name, InternationalString namePlural) {
		Resource level = model.jenaModel().createResource(uri);
		level.addProperty(RDF.type, UDC.Level);

		Resource dimension = this.resource;
		dimension.addProperty(UDC.containsLevel, level);
		level.addProperty(UDC.inDimesion, dimension);
		LevelSQL levelSQL = new LevelSQL(level,model);
		levelSQL.setName(name);
		levelSQL.setNamePlural(namePlural);
		return levelSQL;
	}

	@Override
	public Collection<Level> listLevels() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void delete() {
		// TODO Auto-generated method stub
		
	}
}
