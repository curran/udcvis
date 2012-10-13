package org.curransoft.ash;

/**
 * The inverse of AtomicActionCreate.
 * 
 * @author curran
 * 
 */
public class AtomicActionUncreate extends AtomicAction {
	/**
	 * The id of the resource to uncreate. This id is expected to be the same as
	 * the id of the resource on the top of the resource stack of the model,
	 * which will be popped and deleted upon execution of this action. This is
	 * required for runtime consistency checking only.
	 */
	public final int id;

	/**
	 * Creates a new object, no side effect.
	 * 
	 * @param id
	 *            The id of the resource to uncreate. This id is expected to be
	 *            the same as the id of the resource on the top of the resource
	 *            stack of the model, which will be popped and deleted upon
	 *            execution of this action. This is required for runtime
	 *            consistency checking only.
	 */
	public AtomicActionUncreate(int id) {
		this.id = id;
	}
	/**
	 * Returns a string encoding of this atomic action. This encoding can be
	 * decoded by AtomicAction.fromString().
	 */
	public String toString() {
		return "uc " + id;
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
		AtomicActionUncreate other = (AtomicActionUncreate) obj;
		if (id != other.id)
			return false;
		return true;
	}
}
