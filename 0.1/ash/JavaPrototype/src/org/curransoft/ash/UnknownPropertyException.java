package org.curransoft.ash;

@SuppressWarnings("serial")
public class UnknownPropertyException extends RuntimeException {
	public UnknownPropertyException(String property) {
		super(property);
	}
}
