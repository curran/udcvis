package org.curransoft.ash;

import java.util.Collection;
import java.util.LinkedList;

/**
 * A utility class for ASH containing static convenience methods
 * 
 * @author curran
 * 
 */
public class ASHUtils {
	/**
	 * Returns a collection of strings containing only the given string.
	 */
	public static Collection<String> toList(String s) {
		Collection<String> c = new LinkedList<String>();
		c.add(s);
		return c;
	}
}
