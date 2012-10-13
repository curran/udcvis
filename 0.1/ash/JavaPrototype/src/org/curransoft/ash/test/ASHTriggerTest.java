package org.curransoft.ash.test;


/**
 * A test for ASH triggers.
 * 
 * @author curran
 * 
 */
public class ASHTriggerTest extends ASHTest {
//	private static String triggerTestType = "http://www.datacubes.info/ash/types/triggerTest";

	public static void main(String[] args) {
//		System.out.println("running ASHTriggerTest");
//		initSimplePluginLoader();
//		final List<String> triggerIndicator = new LinkedList<String>();
//		registerPlugin(new ASHPlugin() {
//			public ASHResource createResource(String type, final int id) {
//				if (type.equals(triggerTestType)) {
//					ASHResourceAdapter resource = new SimpleResource(type, id);
//					ASH.addTrigger(new Trigger() {
//						public void run() {
//							triggerIndicator.add("here");
//						}
//					}, id, "foo", "bar");
//					return resource;
//				}
//				return null;
//			}
//
//			public Collection<String> getResourceTypes() {
//				return ASHUtils.toList(triggerTestType);
//			}
//		});
//
//		// test that the trigger is executed
//		ASHTransaction tx = ASH.begin();
//		int r = tx.create(triggerTestType);
//		tx.set(r, "foo", "bar");
//		ASH.commit(tx);
//		ASH.executePendingTriggers();
//		assertEquals(triggerIndicator.size(), 1);
//
//		// test that the trigger is executed only once for two actions within
//		// the same transaction
//		tx = ASH.begin();
//		tx.set(r, "foo", "bar");
//		tx.set(r, "bar", "foo");
//		tx.set(r, "foo", "baz");
//		ASH.commit(tx);
//		ASH.executePendingTriggers();
//		assertEquals(triggerIndicator.size(), 2);
//
//		// test that the trigger is executed only once for two actions across
//		// transactions
//		tx = ASH.begin();
//		tx.set(r, "foo", "bar");
//		ASH.commit(tx);
//		tx = ASH.begin();
//		tx.set(r, "bar", "foo");
//		tx.set(r, "foo", "baz");
//		ASH.commit(tx);
//		ASH.executePendingTriggers();
//		assertEquals(triggerIndicator.size(), 3);
//
//		success();
	}
}
