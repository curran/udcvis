package org.curransoft.ash;

/**
 * An atomic action which sets the value of a resource property.
 * 
 * @author curran
 * 
 */
public class AtomicActionSet extends AtomicAction {
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
	 *            The value to set the property to
	 */
	public AtomicActionSet(int id, String property, String value) {
		this.id = id;
		this.property = property;
		this.value = value;
	}

	/**
	 * Returns a string encoding of this atomic action. This encoding can be
	 * decoded by AtomicAction.fromString().
	 */
	public String toString() {
		return "s " + id + " " + property + " " + value;
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
		AtomicActionSet other = (AtomicActionSet) obj;
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
