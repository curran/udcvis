package org.ivpr.udc.sql;

import java.util.Date;

import org.ivpr.udc.core.DCResource;

import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.vocabulary.DC;

public class DCResourceSQL extends UDCResourceSQL implements DCResource {

	public DCResourceSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
	}

	@Override
	public void delete() {
		// TODO Auto-generated method stub

	}

	@Override
	public String contributor() {
		return resource.getProperty(DC.contributor).getString();
	}

	@Override
	public String coverage() {
		return resource.getProperty(DC.coverage).getString();
	}

	@Override
	public String creator() {
		return resource.getProperty(DC.creator).getString();
	}

	@Override
	public Date dateAvailable() {
//		return resource.getProperty(DC.dateAvailable).getString();
		return null;
	}

	@Override
	public Date dateCreated() {
		return null;
	}

	@Override
	public String publisher() {
		return resource.getProperty(DC.publisher).getString();
	}

	@Override
	public String rights() {
		return resource.getProperty(DC.rights).getString();
	}

	public void setContributor(String contributor) {
		resource.addProperty(DC.contributor, contributor);
	}

	@Override
	public void setCoverage(String coverage) {
		resource.addProperty(DC.coverage, coverage);
	}

	@Override
	public void setCreator(String creator) {
		resource.addProperty(DC.creator, creator);

	}

	@Override
	public void setDateAvailable(Date dateAvailable) {
//		resource.addProperty(DC.dateAvailable, dateAvailable);

	}

	@Override
	public void setDateCreated(Date dateCreated) {
//		resource.addProperty(DC.dateCreated, dateCreated);

	}

	@Override
	public void setPublisher(String publisher) {
		resource.addProperty(DC.publisher, publisher);

	}

	@Override
	public void setRights(String rights) {
		resource.addProperty(DC.rights, rights);

	}

	@Override
	public void setSource(String source) {
		resource.addProperty(DC.source, source);

	}

	@Override
	public void setSubject(String subject) {
		resource.addProperty(DC.subject, subject);

	}

	@Override
	public String source() {
		return null;
	}

	@Override
	public String subject() {
		return null;
	}

}
