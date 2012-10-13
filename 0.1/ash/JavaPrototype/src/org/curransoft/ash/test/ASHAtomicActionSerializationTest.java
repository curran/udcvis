package org.curransoft.ash.test;

import org.curransoft.ash.AtomicAction;
import org.curransoft.ash.AtomicActionCreate;
import org.curransoft.ash.AtomicActionDelete;
import org.curransoft.ash.AtomicActionSet;
import org.curransoft.ash.AtomicActionUncreate;
import org.curransoft.ash.AtomicActionUndelete;
import org.curransoft.ash.AtomicActionUnset;

/**
 * A test for serializing and deserializing all types of atomic actions.
 * 
 * @author curran
 * 
 */
public class ASHAtomicActionSerializationTest extends ASHTest {
	public static void main(String[] args) {
		System.out.println("running ASHTransactionTest");
		initSimplePluginLoader();
		registerSimplePlugin();

		AtomicActionCreate create = new AtomicActionCreate("foo", 3);
		assertEquals(create, AtomicAction.fromString(create.toString()));

		AtomicActionUncreate uncreate = new AtomicActionUncreate(3);
		assertEquals(uncreate, AtomicAction.fromString(uncreate.toString()));
		
		AtomicActionDelete delete = new AtomicActionDelete(3);
		assertEquals(delete, AtomicAction.fromString(delete.toString()));
		
		AtomicActionUndelete undelete = new AtomicActionUndelete(3);
		assertEquals(undelete, AtomicAction.fromString(undelete.toString()));
		
		AtomicActionSet set = new AtomicActionSet(3, "foo", "bar");
		assertEquals(set, AtomicAction.fromString(set.toString()));

		AtomicActionUnset unset = new AtomicActionUnset(3, "foo", "bar");
		assertEquals(unset, AtomicAction.fromString(unset.toString()));

		AtomicActionUnset unset2 = new AtomicActionUnset(3, "foo", null);
		assertEquals(unset2, AtomicAction.fromString(unset2.toString()));
		
		success();
	}

}
