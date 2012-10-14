package org.ivpr.udc.core;

import java.util.Collection;

/**
 * A common interface for resource classes with a uri, name, and description.
 * 
 * @author curran
 * 
 */
public interface UDCResource {
	/**
	 * Gets the globally unique URI for this resource.
	 */
	public String uri();

	/**
	 * Gets the primary name for this resource.
	 */
	public InternationalString name();

	/**
	 * Sets the primary name for this resource.
	 * 
	 * @param name
	 *            The human readable name for this resource
	 * @param languageCode
	 *            the ISO language code specifying the language of the name.
	 */
	public void setName(InternationalString name);

	/**
	 * Gets a collection of localized alternate names for this resource
	 * (excluding the primary name)
	 */
	public Collection<LocalizedString> alternateNames();

	/**
	 * Adds a localized alternate name to this resource
	 */
	public void addAlternateName(LocalizedString alternateName);

	/**
	 * Gets a human readable description of this resource.
	 */
	public String description();

	/**
	 * Sets a human readable description of this resource.
	 */
	public void setDescription(String description);

	/**
	 * Deletes this resource and all resources contained within it.
	 */
	public void delete();
}
