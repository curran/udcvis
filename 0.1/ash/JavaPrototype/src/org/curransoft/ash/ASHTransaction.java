package org.curransoft.ash;

import java.util.Iterator;

/**
 * This class represents a pending transaction for ASH model manipulation.
 * 
 * @author curran
 * 
 */
public class ASHTransaction {
	/**
	 * The micro-state id of the ASH model at the time this transaction was
	 * created.
	 */
	public final int beginMicroStateID;

	/**
	 * The state of the resource id generator counter at the time this
	 * transaction was created.
	 */
	private int resourceIdCounter;

	/**
	 * The object that takes care of recording and collapsing sequences of
	 * atomic actions.
	 */
	private AtomicActionSequence actions = new AtomicActionSequence();

	/**
	 * Creates a new pending transaction, beginning with the system at the
	 * specified state
	 * 
	 * @param beginMicroStateID
	 *            The micro-state id of the ASH model at the time this
	 *            transaction was created.
	 * @param beginResourceIdCounter
	 *            The state of the resource id generator counter at the time
	 *            this transaction was created.
	 */
	public ASHTransaction(int beginMicroStateID, int beginResourceIdCounter) {
		this.beginMicroStateID = beginMicroStateID;
		this.resourceIdCounter = beginResourceIdCounter;
	}

	/**
	 * Gets the iterator for the list of non-redundant atomic actions of this
	 * transaction.
	 */
	public Iterator<AtomicAction> iterator() {
		return actions.getForewardActions().iterator();
	}

	/**
	 * Creates a new resource of the given type and returns its id. This action
	 * is not actually executed until ASH.commit() is called.
	 * 
	 * @param type
	 *            the URI identifying the type of resource to be created.
	 */
	public int create(String type) {
		int id = resourceIdCounter++;
		actions.addAtomicAction(new AtomicActionCreate(type, id),
				new AtomicActionUncreate(id));
		return id;
	}

	/**
	 * Deletes a resource (can be undeleted later)
	 */
	public void delete(int id) {
		actions.addAtomicAction(new AtomicActionDelete(id), new AtomicActionUndelete(id));
	}

	/**
	 * Sets the given property of the given resource (id) to the given value.
	 */
	public void set(int id, String property, String value) {
		AtomicActionSet set = new AtomicActionSet(id, property, value);
		String oldValue = ASH.get(id, property);
		AtomicActionUnset unset = new AtomicActionUnset(id, property, oldValue);
		actions.addAtomicAction(set, unset);
	}

	/**
	 * Sets the given property of the given resource (id) to the given value.
	 */
	public void set(int id, String property, int value) {
		set(id, property, Integer.toString(value));
	}

	/**
	 * Gets the list of non-redundant atomic actions and their inverses for this transaction.
	 */
	public AtomicActionSequence getActions() {
		return actions;
	}
}
