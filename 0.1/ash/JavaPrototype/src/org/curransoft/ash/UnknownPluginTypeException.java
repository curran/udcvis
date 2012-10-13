package org.curransoft.ash;

/**
 * The kind of exception thrown when a plugin is requested whose type cannot be
 * resolved.
 * 
 * @author curran
 * 
 */
@SuppressWarnings("serial")
public class UnknownPluginTypeException extends RuntimeException {
	public final String type;

	/**
	 * 
	 * @param type
	 *            the URI of the unrecognized type
	 */
	public UnknownPluginTypeException(String type) {
		super(type);
		this.type = type;
	}
}
