package org.curransoft.quadstream;

import java.io.File;
import java.io.FileFilter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import com.mchange.v2.c3p0.DataSources;
import com.thoughtworks.xstream.XStream;

public class ShapesConfigManager {
	private static ShapesConfigManager INSTANCE = null;
	private Map<String, ShapesConfig> configs = new HashMap<String, ShapesConfig>();
	private Map<String, DataSource> dataSources = new HashMap<String, DataSource>();
	private boolean isInitialized = false;

	private ShapesConfigManager() {
	}

	public static ShapesConfigManager getInstance() {
		if (INSTANCE == null)
			INSTANCE = new ShapesConfigManager();
		return INSTANCE;
	}

	/**
	 * Reads all shape configuration files and initializes connection pools for
	 * each.
	 * 
	 * @return an error message if failure, null if success.
	 */
	public String initialize() {
		try {
			for (ShapesConfig conf : readConfigs()) {
				
				configs.put(conf.id, conf);
				dataSources.put(conf.id, createPooledDataSource(conf));
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return "Missing file: " + e.getMessage();
		} catch (SQLException e) {
			e.printStackTrace();
			return "Database error: " + e.getMessage();
		}
		isInitialized = true;
		return null;
	}

	private DataSource createPooledDataSource(ShapesConfig conf)
			throws SQLException {
		DataSource unpooled = DataSources.unpooledDataSource(
				"jdbc:mysql://"+conf.getSqlHost()+"/" + conf.sqlDatabase, conf.sqlUser,
				conf.sqlPassword);
		return DataSources.pooledDataSource(unpooled);
	}

	private List<ShapesConfig> readConfigs() throws FileNotFoundException {
		List<ShapesConfig> configs = new ArrayList<ShapesConfig>();
		XStream xstream = new XStream();
		xstream.alias("shapes", ShapesConfig.class);

		// TODO use configuration file/build variable to determine this path
		File dir = new File("./src/main/config");
		File[] files = dir.listFiles(new FileFilter() {
			public boolean accept(File f) {
				return f.getName().endsWith(".xml");
			}
		});
		for (int i = 0; i < files.length; i++)
			configs.add((ShapesConfig) xstream
					.fromXML(new FileReader(files[i])));
		return configs;
	}

	public ShapesConfig getConfig(String id) {
		return configs.get(id);
	}

	public Connection getConnection(ShapesConfig conf) throws SQLException {
		return dataSources.get(conf.id).getConnection();
	}

	public Collection<String> getAllConfigIds() {
		return configs.keySet();
	}

	public boolean isInitialized() {
		return isInitialized;
	}
}
