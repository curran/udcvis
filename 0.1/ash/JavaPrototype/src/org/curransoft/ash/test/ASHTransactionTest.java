package org.curransoft.ash.test;

import org.curransoft.ash.ASH;
import org.curransoft.ash.ASHTransaction;
import org.curransoft.ash.AtomicAction;
import org.curransoft.ash.AtomicActionCreate;
import org.curransoft.ash.AtomicActionDelete;

/**
 * Tests ASH transactions, including collapsing of redundant actions (repeated
 * 'set' on the same property, and canceling 'create' ... 'delete' pairs).
 * 
 * @author curran
 * 
 */
public class ASHTransactionTest extends ASHTest {
	

	/**
	 * A unit test for ASHTransaction operations.
	 */
	public static void main(String[] args) {
		System.out.println("running ASHTransactionTest");
		initSimplePluginLoader();
		registerSimplePlugin();
		
		testCreate();
		testDelete();
		testDeleteCollapse();
		testSet();
		testSetCollapse();

		testDeleteCollapseWithSetActions();
		success();
	}

	private static void testCreate() {
		ASHTransaction tx = ASH.begin();

		tx.create(simpleType);

		int n = 0;
		for (AtomicAction a : tx.getActions().getForewardActions()) {
			assertTrue(a instanceof AtomicActionCreate);
			n++;
		}
//		printActions(tx);
		assertEquals(n, 1);
	}

	private static void testDelete() {
		ASHTransaction tx = ASH.begin();
		int r = tx.create(simpleType);
		ASH.commit(tx);
		tx = ASH.begin();
		tx.delete(r);

		int n = 0;
		for (AtomicAction a : tx.getActions().getForewardActions()) {
			assertTrue(a instanceof AtomicActionDelete);
			n++;
		}
		assertEquals(n, 1);
	}

	private static void testDeleteCollapse() {
		ASHTransaction tx = ASH.begin();
		int r = tx.create(simpleType);
		tx.delete(r);
		assertEquals(tx.getActions().getForewardActions().size(), 0);
	}

	private static void testSet() {
		ASHTransaction tx = ASH.begin();
		int r = tx.create(simpleType);
		tx.set(r, "foo", "bar");
		tx.set(r, "bar", "foo");
		// printActions(tx);
		assertEquals(tx.getActions().getForewardActions().size(), 3);
		ASH.commit(tx);
		assertEquals(ASH.get(r, "foo"), "bar");
		assertEquals(ASH.get(r, "bar"), "foo");
	}

	private static void testSetCollapse() {
		ASHTransaction tx = ASH.begin();
		int r = tx.create(simpleType);
		tx.set(r, "foo", "bar");
		tx.set(r, "bar", "foo");
		tx.set(r, "foo", "baz");
		// printActions(tx);
		assertEquals(tx.getActions().getForewardActions().size(), 3);
		ASH.commit(tx);
		assertEquals(ASH.get(r, "foo"), "baz");
		assertEquals(ASH.get(r, "bar"), "foo");
	}

	private static void testDeleteCollapseWithSetActions() {
		ASHTransaction tx = ASH.begin();
		int r = tx.create(simpleType);
		tx.set(r, "foo", "bar");
		tx.set(r, "bar", "foo");
		tx.delete(r);
		// printActions(tx);
		assertEquals(tx.getActions().getForewardActions().size(), 0);

		tx = ASH.begin();
		r = tx.create(simpleType);
		tx.set(r, "foo", "bar");
		tx.set(r, "bar", "foo");
		int r1 = tx.create(simpleType);
		tx.set(r1, "foo", "bar1");
		tx.set(r1, "bar", "foo1");
		tx.delete(r);
		// printActions(tx);
		assertEquals(tx.getActions().getForewardActions().size(), 3);
	}

}