package org.ivpr.udc.sql;

import java.util.Collection;
import java.util.LinkedList;

import org.ivpr.udc.core.InternationalString;
import org.ivpr.udc.core.LocalizedString;
import org.ivpr.udc.core.UDCResource;

import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;
import com.hp.hpl.jena.vocabulary.DC;
import com.hp.hpl.jena.vocabulary.DCTerms;

public abstract class UDCResourceSQL implements UDCResource {
	protected Resource resource;
	protected UDCModelSQL model;

	public UDCResourceSQL(Resource resource, UDCModelSQL model) {
		this.resource = resource;
		this.model = model;
	}

	@Override
	public void addAlternateName(LocalizedString alternateName) {
		resource.addProperty(DCTerms.alternative, alternateName.content,
				alternateName.language);
	}

	@Override
	public Collection<LocalizedString> alternateNames() {
		StmtIterator i = resource.listProperties(DCTerms.alternative);
		Collection<LocalizedString> localizedStrings = new LinkedList<LocalizedString>();
		for (; i.hasNext();) {
			Statement stmt = i.nextStatement();
			String language = stmt.getLanguage();
			String content = stmt.getString();
			localizedStrings.add(new LocalizedString(content, language));
		}
		i.close();
		return localizedStrings;
	}

	@Override
	public String description() {
		return resource.getProperty(DC.description).getString();
	}

	@Override
	public InternationalString name() {
		StmtIterator i = resource.listProperties(DC.title);
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
	public void setDescription(String description) {
		resource.removeAll(DC.description);
		resource.addProperty(DC.description, description);
	}

	public void setName(InternationalString name) {
		resource.removeAll(DC.title);
		for (LocalizedString s : name.getLocalizedStrings())
			resource.addProperty(DC.title, s.content, s.language);
	}

	public String uri() {
		return resource.getURI();
	}

	public abstract void delete();

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((resource == null) ? 0 : resource.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		UDCResourceSQL other = (UDCResourceSQL) obj;
		if (resource == null) {
			if (other.resource != null)
				return false;
		} else if (!resource.equals(other.resource))
			return false;
		return true;
	}
	

}



















































































