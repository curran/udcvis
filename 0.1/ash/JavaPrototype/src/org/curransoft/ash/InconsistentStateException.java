package org.curransoft.ash;

/**
 * The exception thrown when the ASH session is in an inconsistent state.
 * 
 * @author curran
 * 
 */
@SuppressWarnings("serial")
public class InconsistentStateException extends RuntimeException {
	public InconsistentStateException(String message) {
		super(message);
	}
}
