package org.curransoft.ash;

/**
 * The atomic action which encapsulates the undeletion of an existing node. This
 * is similar to AtomicActionCreate, but is the distinctly different because it
 * is the inverse of a delete operation on a resource which previously existed.
 * 
 * @author curran
 * 
 */
public class AtomicActionUndelete extends AtomicAction {
	/**
	 * The id of the resource to undelete.
	 */
	public final int id;

	/**
	 * Creates a new object, no side effect.
	 * 
	 * @param id
	 *            The id of the resource to undelete.
	 */
	public AtomicActionUndelete(int id) {
		this.id = id;
	}
	/**
	 * Returns a string encoding of this atomic action. This encoding can be
	 * decoded by AtomicAction.fromString().
	 */
	public String toString() {
		return "ud " + id;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + id;
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
		AtomicActionUndelete other = (AtomicActionUndelete) obj;
		if (id != other.id)
			return false;
		return true;
	}
}
