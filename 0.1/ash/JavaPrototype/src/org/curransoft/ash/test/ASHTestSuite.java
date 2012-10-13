package org.curransoft.ash.test;
/**
 * Runs all ASH unit tests: ASHTransactionTest and ASHAtomicActionSerializationTest
 * @author curran
 *
 */
public class ASHTestSuite {

	public static void main(String[] args) {
		ASHTransactionTest.main(null);
		ASHAtomicActionSerializationTest.main(null);
		ASHTriggerTest.main(null);
	}
}
