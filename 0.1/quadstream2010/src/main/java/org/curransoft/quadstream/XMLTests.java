package org.curransoft.quadstream;


import com.thoughtworks.xstream.XStream;

public class XMLTests {

	public static void main(String[] args) {
		XStream xstream = new XStream();
		xstream.alias("shapes", ShapesConfig.class);

		ShapesConfig conf = new ShapesConfig();
		conf.setDescription("description goes here");
		conf.setId("id");
		conf.setName("name");
		conf.setSqlDatabase("database");
		conf.setSqlPassword("password");
		conf.setSqlTablePrefix("table prefix");
		conf.setSqlUser("user");
		if (conf.equals((ShapesConfig)xstream.fromXML(xstream.toXML(conf))))
			System.out.println("success");

	}
}
