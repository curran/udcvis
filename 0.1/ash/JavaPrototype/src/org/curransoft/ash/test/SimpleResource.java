package org.curransoft.ash.test;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.curransoft.ash.ASHResourceAdapter;

public class SimpleResource extends ASHResourceAdapter {
	Map<String, String> properties = new HashMap<String, String>();

	public SimpleResource(String type, int id) {
		super(type, id);
	}

	public void set(String property, String value) {
		properties.put(property, value);
	}

	public Collection<String> listProperties() {
		return properties.keySet();
	}

	public String get(String property) {
		return properties.get(property);
	}

	public void removeProperty(String property) {
		properties.remove(property);
	}

	public void destroy() {
		properties = null;
	}

	public void kill() {
	}

	public void resurrect() {
	}
}
