package org.curransoft.ash;

import java.util.Collections;
import java.util.List;

/**
 * The ASH API. Only this class (not ASHModel) should be invoked directly by
 * ASHResource implementations. This class is a singleton, accessed through
 * static functions, which must first be initialized by calling init().
 * 
 * @author curran
 * 
 */
public class ASH {
	/**
	 * The singleton ASH instance
	 */
	private static ASH instance;

	/**
	 * The current model for this ASH session.
	 */
	private final ASHModel model;

	/**
	 * The node in the session history graph which represents the current
	 * application state.
	 */
	ASHState currentState;

	/**
	 * The id of the current state within the current session state transition.
	 * Each begin() commit() pair causes this number to increment by 1. Each
	 * call to commitTransition() causes this number to be reset to 0.
	 */
	int currentMicroStateId = 0;

	/**
	 * A flag set to true while in the process of creating a new resource.
	 */
	boolean insideCreateAction = false;
	/**
	 * The transaction summarizing the transition from the current state to the
	 * next state in the session state transition network.
	 */
	private AtomicActionSequence pendingStateTransition;

	/**
	 * ASH executes all transactions in a synchronized(lock){} block using this
	 * lock object. This is so that enclosing systems can ensure they are never
	 * reading an inconsistent state by executing their critical sections using
	 * the lock as follows: synchronized(ASH.getLock()){..your code that reads
	 * the ASH state goes here..} ..the rest of your code goes here...
	 */
	private final String lock = "";

	/**
	 * Private constructor to enforce singleton.
	 */
	private ASH(ASHModel model) {
		this.model = model;
		this.currentState = new ASHState();
		this.pendingStateTransition = new AtomicActionSequence();
	}

	/**
	 * Initializes the ASH singleton using the given plugin loader. This
	 * function must be called in order for ASH to function at all, and must
	 * ever be called only once.
	 */
	public static void init(ASHPluginLoader pluginLoader) {
		if (instance == null)
			instance = new ASH(new ASHModel(pluginLoader));
		else
			throw new RuntimeException(
					"ASH.init() called twice, must only ever be called once!");
	}

	/**
	 * Begins a transaction in this session.
	 */
	public static ASHTransaction begin() {
		synchronized (instance) {
			return new ASHTransaction(instance.currentMicroStateId,
					instance.model.getResourceIdCounterValue());
		}
	}

	/**
	 * Commits the current transaction in this session (must be called after
	 * begin()). This may cause triggers to become "pending", or "dirty". These
	 * triggers will be executed the next time executePendingTriggers() is
	 * called.
	 * 
	 * @return true if successful, false if not. If false is returned, the
	 *         transaction was rolled back and must be created again in order to
	 *         get the desired result.
	 * @throws UnknownPluginTypeException
	 */
	public static boolean commit(ASHTransaction transaction)
			throws UnknownPluginTypeException {
		synchronized (instance.lock) {
			boolean transactionIsValid = instance.currentMicroStateId == transaction.beginMicroStateID;
			if (transactionIsValid) {
				AtomicActionSequence actions = transaction.getActions();
				for (AtomicAction action : actions.getForewardActions())
					execute(action);
				instance.pendingStateTransition
						.addAtomicActionSequence(actions);
				instance.currentMicroStateId++;
			}
			return transactionIsValid;
		}
	}

	/**
	 * Commits the current state as an application session state transition.
	 * This causes the current state to appear as a node in the session history
	 * graph.
	 */
	public static void commitStateTransition() {
		if (instance.currentMicroStateId != 0) {
			synchronized (instance.lock) {
				ASHState u = instance.currentState;
				ASHState v = new ASHState();
				List<AtomicAction> u2v = instance.pendingStateTransition
						.getForewardActions();
				List<AtomicAction> v2u = instance.pendingStateTransition
						.getBackwardActions();
				Collections.reverse(v2u);
				ASHStateTransition edge = new ASHStateTransition(u, v, u2v, v2u);
				u.addOutgoingEdge(edge);
				v.setIncomingEdge(edge);

				instance.currentMicroStateId = 0;
				instance.currentState = v;
				instance.pendingStateTransition = new AtomicActionSequence();
			}
		}
	}

	/**
	 * Actually executes the given atomic action on the current model.
	 */
	private static void execute(AtomicAction action) {
		if (action instanceof AtomicActionCreate) {
			AtomicActionCreate create = (AtomicActionCreate) action;
			instance.insideCreateAction = true;
			int id = instance.model.create(create.type);
			instance.insideCreateAction = false;
			if (id != create.id)
				throw new InconsistentStateException(
						"Create action resulted in unexpedted id: expecting "
								+ create.id + ", expected " + id);
		} else if (action instanceof AtomicActionUncreate) {
			AtomicActionUncreate uncreate = (AtomicActionUncreate) action;
			instance.model.uncreate(uncreate.id);
		} else if (action instanceof AtomicActionSet) {
			AtomicActionSet set = (AtomicActionSet) action;
			int id = set.id;
			String property = set.property;
			instance.model.set(id, property, set.value);

			// List<Trigger> triggersForProperty = triggers(id, property);
			// if (triggersForProperty != null)
			// instance.pendingTriggers.addAll(triggersForProperty);
		} else if (action instanceof AtomicActionUnset) {
			AtomicActionUnset unset = (AtomicActionUnset) action;
			int id = unset.id;
			String property = unset.property;
			instance.model.unset(id, property, unset.value);

			// List<Trigger> triggersForProperty = triggers(id, property);
			// if (triggersForProperty != null)
			// instance.pendingTriggers.addAll(triggersForProperty);
		} else
			throw new RuntimeException("Atomic action type not handled: "
					+ action.getClass());
	}

	/**
	 * Gets the value of the given property for the resource with the given id
	 * in the current ASH session state model.
	 */
	public static String get(int id, String property) {
		return instance.model.get(id, property);
	}

	/**
	 * Calls get() and returns the value as an integer.
	 */
	public static int getInt(int id, String property) {
		return Integer.parseInt(get(id, property));
	}

	public static boolean hasBeenInitialized() {
		return instance != null;
	}

	/**
	 * Performs an undo. This traverses the session history graph, making the
	 * previous state the current state by executing the appropriate stored
	 * atomic actions.
	 */
	public static void undo() {
		ASHStateTransition undoEdge = instance.currentState.getIncomingEdge();
		if (undoEdge != null) {
			// sanity check
			if (undoEdge.v != instance.currentState)
				throw new RuntimeException();

			for (AtomicAction action : undoEdge.v2u) {
				execute(action);
				System.out.println(action);
			}
			undoEdge.u.setRedoEdge(undoEdge);
			instance.currentState = undoEdge.u;
		}
	}

	/**
	 * Performs a redo. This traverses the session history graph, making the
	 * next state the current state by executing the appropriate stored atomic
	 * actions.
	 */
	public static void redo() {
		ASHStateTransition redoEdge = instance.currentState.getRedoEdge();
		if (redoEdge != null) {
			// sanity check
			if (redoEdge.u != instance.currentState)
				throw new RuntimeException(
						"redoEdge.u != instance.currentState - this should never happen!");

			for (AtomicAction action : redoEdge.u2v)
				execute(action);

			instance.currentState = redoEdge.v;

			redoEdge.u.setRedoEdge(null);
		}
	}

	/**
	 * ASH executes all transactions in a synchronized(lock){} block using the
	 * 'lock' object returned by this method. This is so that enclosing systems
	 * can ensure they are never reading an inconsistent state by executing
	 * their critical sections using the lock as follows:
	 * synchronized(ASH.getLock()){..your code goes here..}
	 */
	public static Object getLock() {
		return instance.lock;
	}
}
