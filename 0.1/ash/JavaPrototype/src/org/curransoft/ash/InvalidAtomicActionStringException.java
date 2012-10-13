package org.curransoft.ash;

/**
 * Thrown when an invalid atomic action encoding is attempted to be decoded.
 * 
 * @author curran
 * 
 */
@SuppressWarnings("serial")
public class InvalidAtomicActionStringException extends RuntimeException {
	/**
	 * Creates a new exception with the given (invalid) atomic action encoding.
	 */
	public InvalidAtomicActionStringException(String actionString) {
		super(actionString);
	}
}
