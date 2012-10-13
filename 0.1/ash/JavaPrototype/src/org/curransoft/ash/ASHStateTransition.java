package org.curransoft.ash;

import java.util.List;

/**
 * An edge in the session state transition network. Nodes are ASHStates.
 * 
 * @author curran
 * 
 */
public class ASHStateTransition {
	/**
	 * The node this edge is coming from.
	 */
	public final ASHState u;
	/**
	 * The node this edge is going to.
	 */
	public final ASHState v;
	/**
	 * The sequence of atomic actions which will take the application model from
	 * state u to state v.
	 */
	public final List<AtomicAction> u2v;

	/**
	 * The sequence of inverse atomic actions which will take the application
	 * model from state v to state u.
	 */
	public final List<AtomicAction> v2u;

	/**
	 * Creates a new state transition edge between two existing states.
	 * 
	 * @param u
	 *            The node this edge is coming from.
	 * @param v
	 *            The node this edge is going to.
	 * @param u2v
	 *            The sequence of atomic actions which will take the application
	 *            model from state u to state v.
	 * @param v2u
	 *            The sequence of inverse atomic actions which will take the
	 *            application model from state v to state u.
	 */
	public ASHStateTransition(ASHState u, ASHState v, List<AtomicAction> u2v,
			List<AtomicAction> v2u) {
		this.u = u;
		this.v = v;
		this.u2v = u2v;
		this.v2u = v2u;
	}
}
