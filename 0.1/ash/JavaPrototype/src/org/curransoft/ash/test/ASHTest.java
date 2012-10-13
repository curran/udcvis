package org.curransoft.ash.test;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.curransoft.ash.ASH;
import org.curransoft.ash.ASHPlugin;
import org.curransoft.ash.ASHPluginLoader;
import org.curransoft.ash.ASHResource;
import org.curransoft.ash.ASHTransaction;
import org.curransoft.ash.ASHUtils;
import org.curransoft.ash.AtomicAction;
import org.curransoft.ash.UnknownPluginTypeException;

/**
 * The base class for ASH unit tests containing static convenience methods.
 * 
 * @author curran
 * 
 */
public class ASHTest {
	static String simpleType = "http://www.datacubes.info/ash/types/simple";

	protected static Map<String, ASHPlugin> plugins = new HashMap<String, ASHPlugin>();

	protected static void initSimplePluginLoader() {
		if (!ASH.hasBeenInitialized())
			ASH.init(new ASHPluginLoader() {
				public ASHPlugin getPlugin(String type) {
					ASHPlugin plugin = plugins.get(type);
					if (plugin != null)
						return plugin;
					else
						throw new UnknownPluginTypeException(type);
				}
			});
	}

	protected static void registerSimplePlugin() {
		registerPlugin(new ASHPlugin() {
			public ASHResource createResource(String type, final int id) {
				if (type.equals(type))
					return new SimpleResource(type, id);
				else
					throw new UnknownPluginTypeException(type);
			}

			public Collection<String> getResourceTypes() {
				return ASHUtils.toList(ASHTest.simpleType);
			}
		});
	}

	protected static void registerPlugin(ASHPlugin plugin) {
		for (String type : plugin.getResourceTypes())
			plugins.put(type, plugin);
	}

	public static void printActions(ASHTransaction tx) {
		for (AtomicAction action : tx.getActions().getForewardActions())
			System.out.println(action.toString());
	}

	protected static void assertEquals(int actual, int expected) {
		if (actual != expected)
			throw new RuntimeException("assertion failed: expected " + expected
					+ " got " + actual);
	}

	protected static void assertEquals(Object actual, Object expected) {
		if (!actual.equals(expected))
			throw new RuntimeException("assertion failed: expected " + expected
					+ " got " + actual);
	}

	protected static void assertTrue(boolean b) {
		if (!b)
			throw new RuntimeException("assertion failed");
	}

	protected static void success() {
		System.out.println("All tests passed!");
	}
}
