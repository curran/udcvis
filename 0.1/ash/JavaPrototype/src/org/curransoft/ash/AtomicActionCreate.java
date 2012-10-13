package org.curransoft.ash;

/**
 * The atomic action which encapsulates the creation a new node.
 * 
 * @author curran
 * 
 */
public class AtomicActionCreate extends AtomicAction {
	/**
	 * The type of the new node to create. This is the same as the IRI returned
	 * by the the getResourceTypeIRI() method of the type's corresponding
	 * resource factory.
	 */
	public final String type;
	/**
	 * The id of the new resource. This id is expected to be the same as the new
	 * id that would be generated for a new object created in the current model
	 * (the index in the resource stack of the new resource), and is required
	 * for consistency checking only.
	 */
	public final int id;

	/**
	 * Creates a new object, no side effects.
	 * 
	 * @param type
	 *            The type of the new node to create. This is the same as the
	 *            IRI returned by the the getResourceTypeIRI() method of the
	 *            type's corresponding resource factory.
	 * @param id
	 *            The id of the new resource. This id is expected to be the same
	 *            as the new id that would be generated for a new object created
	 *            in the current model, and is required for consistency checking
	 *            only.
	 */
	public AtomicActionCreate(String type, int id) {
		this.type = type;
		this.id = id;
	}

	/**
	 * Returns a string encoding of this atomic action. This encoding can be
	 * decoded by AtomicAction.fromString().
	 */
	public String toString() {
		return "c " + id + " " + type;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + id;
		result = prime * result + ((type == null) ? 0 : type.hashCode());
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
		AtomicActionCreate other = (AtomicActionCreate) obj;
		if (id != other.id)
			return false;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		return true;
	}
}
