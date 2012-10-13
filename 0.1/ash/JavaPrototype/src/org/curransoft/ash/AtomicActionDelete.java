package org.curransoft.ash;

/**
 * The atomic action which encapsulates the deletion of an existing node.
 * 
 * @author curran
 * 
 */
public class AtomicActionDelete extends AtomicAction {
	/**
	 * The id of the resource to delete.
	 */
	public final int id;

	/**
	 * Creates a new object, no side effects.
	 * 
	 * @param id
	 *            The id of the resource to delete.
	 */
	public AtomicActionDelete(int id) {
		this.id = id;
	}
	
	public String toString() {
		return "d " + id;
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
		AtomicActionDelete other = (AtomicActionDelete) obj;
		if (id != other.id)
			return false;
		return true;
	}
	
	
}
