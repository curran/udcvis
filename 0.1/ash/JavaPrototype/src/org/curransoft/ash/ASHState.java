package org.curransoft.ash;

import java.util.LinkedList;
import java.util.List;

/**
 * 
 * A node in the session state transition network. Edges are
 * ASHStateTransitions.
 * 
 * @author curran
 * 
 */
public class ASHState {
	/**
	 * The ASHState id generator counter.
	 */
	private static int idCounter;

	/**
	 * The uid for this state
	 */
	public final int id = idCounter++;
	/**
	 * The incoming edge to this node. incomingEdge.v = this node.
	 */
	private ASHStateTransition incomingEdge;

	/**
	 * The outgoing edges from this node. outgoingEdges[i].u = this node.
	 */
	private List<ASHStateTransition> outgoingEdges;

	/**
	 * The redo edge from this node. This is stored when the user executes an
	 * 'undo' and arrives at this node. redoEdge is in outgoingEdges. redoEdge.u
	 * = this node.
	 */
	private ASHStateTransition redoEdge;

	/**
	 * Gets the incoming edge to this node. incomingEdge.v = (this node).
	 */
	public ASHStateTransition getIncomingEdge() {
		return incomingEdge;
	}

	/**
	 * Sets the incoming edge to this node. This must only be called once.
	 * 
	 * @param incomingEdge
	 */
	public void setIncomingEdge(ASHStateTransition incomingEdge) {
		if (this.incomingEdge == null)
			this.incomingEdge = incomingEdge;
		else
			throw new RuntimeException(
					"setIncomingEdge() called twice on an ASHState - this should never happen!");
	}

	/**
	 * Gets the outgoing edge from this node which was last traversed by an undo
	 * operation. This will be null if this state was not arrived at via an undo operation.
	 */
	public ASHStateTransition getRedoEdge() {
		return redoEdge;
	}

	public void setRedoEdge(ASHStateTransition redoEdge) {
		// sanity check
		if (redoEdge!= null && !outgoingEdges.contains(redoEdge))
			throw new RuntimeException(
					"Redo edge not in outgoing edges, this should never happen!");
		this.redoEdge = redoEdge;
	}

	public List<ASHStateTransition> getOutgoingEdges() {
		return outgoingEdges;
	}

	public void addOutgoingEdge(ASHStateTransition edge) {
		if (outgoingEdges == null)
			outgoingEdges = new LinkedList<ASHStateTransition>();
		outgoingEdges.add(edge);
	}
}
