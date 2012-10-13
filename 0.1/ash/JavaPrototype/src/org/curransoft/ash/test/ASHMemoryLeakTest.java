package org.curransoft.ash.test;

/**
 * Tests that there are no memory leaks when repeatedly going forward and
 * backward in session time. This is really testing that the destroy() aspect
 * really works.
 * 
 * @author curran
 * 
 */
public class ASHMemoryLeakTest extends ASHTest {

	/**
	 * A unit test for ASHTransaction operations.
	 */
	public static void main(String[] args) {
		System.out.println("running ASHMemoryLeakTest");

		initSimplePluginLoader();
		registerSimplePlugin();
		// TODO implement
		System.out.println("ASHMemoryLeakTest not implemented!");
		success();
	}
}
