package org.ivpr.udc.core;

@SuppressWarnings("serial")
/**
 * UDC Model implementations should always throw this kind of exception when something goes wrong.
 */
public class UDCException extends RuntimeException {
	public UDCException(String message,Throwable cause) {
		super(message,cause);
	}

	public UDCException(String message) {
		super(message);
	}
}
