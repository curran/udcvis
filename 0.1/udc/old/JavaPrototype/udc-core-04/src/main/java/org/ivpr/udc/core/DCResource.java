package org.ivpr.udc.core;

import java.util.Date;

/**
 * A UDC resource with Dublin Core metadata.
 * 
 * @author curran
 * 
 */
public interface DCResource extends UDCResource {
	
	/**
	 * The name of this data set. Equivalent to the Dublin Core "title" element,
	 * defined by the Dublin Core Metadata Registry as follows: A name given to
	 * the resource.
	 */
	public InternationalString name();

	/**
	 * Sets the name of this data set.
	 */
	public void setName(InternationalString name);

	/**
	 * The creator of this data set. Equivalent to the Dublin Core "creator"
	 * element, defined by the Dublin Core Metadata Registry as follows: An
	 * entity primarily responsible for making the resource. Examples of a
	 * Creator include a person, an organization, or a service. Typically, the
	 * name of a Creator should be used to indicate the entity.
	 */
	public String creator();
	/**
	 * Sets the creator of this data set.
	 */
	public void setCreator(String creator);

	/**
	 * The subject of this data set (as a space delimited list of keywords).
	 * Equivalent to the Dublin Core "subject" element, defined by the Dublin
	 * Core Metadata Registry as follows: The topic of the resource. Typically,
	 * the subject will be represented using keywords, key phrases, or
	 * classification codes. Recommended best practice is to use a controlled
	 * vocabulary. To describe the spatial or temporal topic of the resource,
	 * use the Coverage element.
	 */
	public String subject();

	/**
	 * Sets the subject of this data set (as a space delimited list of keywords).
	 */
	public void setSubject(String subject);

	/**
	 * A human readable free text description of this data set. Equivalent to
	 * the Dublin Core "description" element, defined by the Dublin Core
	 * Metadata Registry as follows: An account of the resource. Description may
	 * include but is not limited to: an abstract, a table of contents, a
	 * graphical representation, or a free-text account of the resource.
	 */
	public String description();
	/**
	 * Sets the human readable free text description of this data set.
	 */
	public void setDescription(String description);

	/**
	 * The publisher of this data set. Equivalent to the Dublin Core "publisher"
	 * element, defined by the Dublin Core Metadata Registry as follows: An
	 * entity responsible for making the resource available. Examples of a
	 * Publisher include a person, an organization, or a service. Typically, the
	 * name of a Publisher should be used to indicate the entity.
	 */
	public String publisher();

	/**
	 * Sets the publisher of this data set.
	 */
	public void setPublisher(String publisher);

	/**
	 * The person or organization which transformed this data set into a UDC
	 * model. Equivalent to the Dublin Core "contributor" element, defined by
	 * the Dublin Core Metadata Registry as: An entity responsible for making
	 * contributions to the resource. Examples of a Contributor include a
	 * person, an organization, or a service. Typically, the name of a
	 * Contributor should be used to indicate the entity.
	 */
	public String contributor();

	/**
	 * Sets the person or organization which transformed this data set into a UDC
	 * model.
	 */
	public void setContributor(String contributor);

	/**
	 * The date when the content of this data set was originally created.
	 * Equivalent to the Dublin Core "date" element refined by dcterms:created,
	 * defined by the Dublin Core Metadata Registry as follows: Date of creation
	 * of the resource.
	 */
	public Date dateCreated();
	/**
	 * Sets the date when the content of this data set was originally created.
	 */
	public void setDateCreated(Date dateCreated);

	/**
	 * The date when the content of this data set was (or will be) made
	 * available as a published UDC model. Equivalent to the Dublin Core "date"
	 * element refined by dcterms:available, defined by the Dublin Core Metadata
	 * Registry as follows: Date (often a range) that the resource became or
	 * will become available.
	 */
	public Date dateAvailable();
	/**
	 * Sets the date when the content of this data set was (or will be) made
	 * available as a published UDC model.
	 */
	public void setDateAvailable(Date dateAvailable);

	/**
	 * A free text description of the source of this data set. Equivalent to the
	 * Dublin Core "source" element, defined by the Dublin Core Metadata
	 * Registry as follows: A related resource from which the described resource
	 * is derived. The described resource may be derived from the related
	 * resource in whole or in part. Recommended best practice is to identify
	 * the related resource by means of a string conforming to a formal
	 * identification system.
	 */
	public String source();

	/**
	 * Sets the free text description of the source of this data set.
	 */
	public void setSource(String source);

	/**
	 * The coverage of this data set. Equivalent to the Dublin Core "coverage"
	 * element, defined by the Dublin Core Metadata Registry as follows: The
	 * spatial or temporal topic of the resource, the spatial applicability of
	 * the resource, or the jurisdiction under which the resource is relevant.
	 */
	public String coverage();

	/**
	 * Sets the coverage of this data set.
	 */
	public void setCoverage(String coverage);

	/**
	 * The rights of this data set. Equivalent to the Dublin Core "rights"
	 * element, defined by the Dublin Core Metadata Registry as follows:
	 * Information about rights held in and over the resource. Typically, rights
	 * information includes a statement about various property rights associated
	 * with the resource, including intellectual property rights.
	 */
	public String rights();
	/**
	 * Sets the rights of this data set.
	 */
	public void setRights(String rights);
}
