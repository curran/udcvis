package org.curransoft.ash;

/**
 * The inverse of AtomicActionSet
 * 
 * @author curran
 * 
 */
public class AtomicActionUnset extends AtomicAction {
	/**
	 * The id of the resource whose property is set by this atomic action.
	 */
	public final int id;
	/**
	 * The property (of the resource with id 'id') to set the value of.
	 */
	public final String property;
	/**
	 * The value to set the property to
	 */
	public final String value;

	/**
	 * Creates a new AtomicActionSet object, no side effects.
	 * 
	 * @param id
	 *            The id of the resource whose property is set by this atomic
	 *            action.
	 * @param property
	 *            The property (of the resource with id 'id') to set the value
	 *            of.
	 * @param value
	 *            The value to unset the property to. Can be null - in this case
	 *            the property record is removed entirely and the default value
	 *            applies (or whatever behavior is expected before the property
	 *            was set).
	 */
	public AtomicActionUnset(int id, String property, String value) {
		this.id = id;
		this.property = property;
		this.value = value;
	}
	/**
	 * Returns a string encoding of this atomic action. This encoding can be
	 * decoded by AtomicAction.fromString().
	 */
	public String toString() {
		return "us " + id + " " + property + (value == null ? "" : " " + value);
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + id;
		result = prime * result
				+ ((property == null) ? 0 : property.hashCode());
		result = prime * result + ((value == null) ? 0 : value.hashCode());
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
		AtomicActionUnset other = (AtomicActionUnset) obj;
		if (id != other.id)
			return false;
		if (property == null) {
			if (other.property != null)
				return false;
		} else if (!property.equals(other.property))
			return false;
		if (value == null) {
			if (other.value != null)
				return false;
		} else if (!value.equals(other.value))
			return false;
		return true;
	}
}
