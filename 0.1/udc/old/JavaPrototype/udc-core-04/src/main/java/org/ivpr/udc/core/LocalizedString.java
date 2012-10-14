package org.ivpr.udc.core;

/**
 * A (string,language) pair.
 * 
 * @author curran
 * 
 */
public class LocalizedString {
	public final String language;
	public final String content;

	/**
	 * Creates a new localized string with the given language and content.
	 * 
	 * @param content
	 *            the content of the localized string
	 * @param language
	 *            the ISO language code describing the language of the content
	 */
	public LocalizedString(String content, String language) {
		this.language = language;
		this.content = content;
	}

	public String toString() {
		return content;
	}

	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((content == null) ? 0 : content.hashCode());
		result = prime * result
				+ ((language == null) ? 0 : language.hashCode());
		return result;
	}

	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		LocalizedString other = (LocalizedString) obj;
		if (content == null) {
			if (other.content != null)
				return false;
		} else if (!content.equals(other.content))
			return false;
		if (language == null) {
			if (other.language != null)
				return false;
		} else if (!language.equals(other.language))
			return false;
		return true;
	}
}
