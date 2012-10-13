package org.curransoft.ash;

import java.util.LinkedList;
import java.util.List;

/**
 * The class responsible for storing sequences of atomic actions (and their
 * inverses), and collapsing redundant actions.
 * 
 * @author curran
 * 
 */
public class AtomicActionSequence {

	/**
	 * The list of non-redundant atomic actions for this transaction.
	 */
	private List<AtomicAction> actions = new LinkedList<AtomicAction>();
	/**
	 * The list of non-redundant inverse atomic actions for this transaction,
	 * which are inverse actions for all actions in the 'actions' list.
	 * (inverseActions[i] = the inverse of actions[i])
	 */
	private List<AtomicAction> inverseActions = new LinkedList<AtomicAction>();

	public void addAtomicAction(AtomicAction foreward, AtomicAction backward) {
		if (foreward instanceof AtomicActionCreate) {
			if (!(backward instanceof AtomicActionUncreate))
				throw new RuntimeException("The inverse of a create action is "
						+ "not an uncreate action, this should never happen!");
			addCreate((AtomicActionCreate) foreward,
					(AtomicActionUncreate) backward);
		} else if (foreward instanceof AtomicActionDelete) {
			if (!(backward instanceof AtomicActionUndelete))
				throw new RuntimeException("The inverse of a delete action is "
						+ "not an undelete action, this should never happen!");
			addDelete((AtomicActionDelete) foreward,
					(AtomicActionUndelete) backward);
		} else if (foreward instanceof AtomicActionSet) {
			if (!(backward instanceof AtomicActionUnset))
				throw new RuntimeException("The inverse of a set action is "
						+ "not an unset action, this should never happen!");
			addSet((AtomicActionSet) foreward, (AtomicActionUnset) backward);
		}
	}

	private void addCreate(AtomicActionCreate create,
			AtomicActionUncreate uncreate) {
		actions.add(create);
		inverseActions.add(uncreate);
	}

	private void addDelete(AtomicActionDelete delete,
			AtomicActionUndelete undelete) {
		if (delete.id != undelete.id)
			throw new RuntimeException("The inverse of a delete action is "
					+ "not an undelete action, this should never happen!");
		// look up the create action for this deletion
		int createIndex = -1;

		for (int i = 0; i < actions.size(); i++) {
			AtomicAction action = actions.get(i);
			if (action instanceof AtomicActionCreate)
				if (((AtomicActionCreate) action).id == delete.id)
					createIndex = i;
		}

		// if createIndex remains -1, it means that the resource with the
		// given id was not created within this transaction, and thus a new
		// delete action should be created.

		// if createIndex is not -1 after this loop, it means that the
		// resource with the the given id was indeed created within this
		// transaction. In this case, the create action and all subsequence
		// set operations on the corresponding id can be deleted from the
		// action list.
		if (createIndex == -1){
			actions.add(delete);
			inverseActions.add(undelete);
		}
		else {
			// step 1: delete all related set actions and their inverses
			for (int i = actions.size() - 1; i > createIndex; i--) {
				AtomicAction action = actions.get(i);
				if (action instanceof AtomicActionSet)
					if (((AtomicActionSet) action).id == delete.id) {
						actions.remove(i);
						inverseActions.remove(i);
					}
			}

			// step 2: delete the create action and its inverse
			actions.remove(createIndex);
			inverseActions.remove(createIndex);
		}

	}

	private void addSet(AtomicActionSet set, AtomicActionUnset unset) {
		// look up any previous sets on this property
		for (int i = 0; i < actions.size(); i++) {
			AtomicAction action = actions.get(i);
			if (action instanceof AtomicActionSet) {
				AtomicActionSet oldSet = (AtomicActionSet) action;
				if (oldSet.id == set.id && oldSet.property.equals(set.property))
					if (oldSet.value.equals(set.value))
						return;
					else {
						// if this property has already been set to something
						// within this transaction, then that previous set
						// operation can be replaced with the new, current one.
						actions.set(i, set);
						return;
					}
			}
		}
		// if we are here, then this set action must be recorded
		actions.add(set);
		inverseActions.add(unset);
	}

	/**
	 * Gets the list of non-redundant atomic actions for this transaction.
	 */
	public List<AtomicAction> getForewardActions() {
		return actions;
	}

	/**
	 * Gets the list of non-redundant inverse atomic actions for this
	 * transaction, which are inverse actions for all actions in the 'actions'
	 * list. (inverseActions[i] = the inverse of actions[i])
	 */
	public List<AtomicAction> getBackwardActions() {
		return inverseActions;
	}

	/**
	 * Adds all atomic actions in the given sequence to this sequence
	 * (collapsing redundant sequences)
	 */
	public void addAtomicActionSequence(AtomicActionSequence actions) {
		List<AtomicAction> forewardActions = actions.getForewardActions();
		List<AtomicAction> backwardActions = actions.getBackwardActions();
		for (int i = 0; i < forewardActions.size(); i++)
			addAtomicAction(forewardActions.get(i), backwardActions.get(i));
	}
}
