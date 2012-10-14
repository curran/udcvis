package org.ivpr.udc.core;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * A collection of localized strings. Only one string per language is allowed.
 * 
 * @author curran
 * 
 */
public class InternationalString {
	private Set<LocalizedString> localizedStrings = new HashSet<LocalizedString>();
	private Map<String, LocalizedString> localizedStringsByLanguage = new HashMap<String, LocalizedString>();

	/**
	 * Creates a new international string from the given collection of localized strings.
	 * @param localizedStrings
	 */
	public InternationalString(Collection<LocalizedString> localizedStrings) {
		this.localizedStrings.addAll(localizedStrings);
		for (LocalizedString ls : localizedStrings) {
			if (localizedStringsByLanguage.put(ls.language, ls) != null)
				throw new UDCException(
						"Error: attempted to create an international string with multiple localized strings for the same language.");
		}
	}

	/**
	 * Gets the collection of localized strings in this international string.
	 */
	public Collection<LocalizedString> getLocalizedStrings() {
		return localizedStrings;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime
				* result
				+ ((localizedStrings == null) ? 0 : localizedStrings.hashCode());
		return result;
	}

	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		InternationalString other = (InternationalString) obj;
		if (localizedStrings == null) {
			if (other.localizedStrings != null)
				return false;
		} else if (!localizedStrings.equals(other.localizedStrings))
			return false;
		return true;
	}

	public String toString() {
		StringBuilder b = new StringBuilder();
		for (LocalizedString s : localizedStrings)
			b.append(s.content + "(" + s.language + ") ");
		return b.toString();
	}
}
