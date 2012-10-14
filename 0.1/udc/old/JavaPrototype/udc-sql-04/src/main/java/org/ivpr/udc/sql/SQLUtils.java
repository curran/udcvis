package org.ivpr.udc.sql;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.ivpr.udc.core.UDCException;

public class SQLUtils {
	/**
	 * Returns true if a table with the specified name exists in the schema of
	 * the given connection.
	 */
	public static boolean tableExists(Connection c, String tableName) {
		DatabaseMetaData dbm;
		try {
			dbm = c.getMetaData();
			String dbType = dbm.getDatabaseProductName();
			if (dbType.equals("HSQL Database Engine")) {
				Statement st = c.createStatement();
				// ResultSet rs = st
				// .executeQuery("SELECT COUNT(*) FROM INFORMATION_SCHEMA.SYSTEM_TABLES WHERE TABLE_SCHEM = 'udc' AND TABLE_NAME = 'test'");
				ResultSet rs = st
						.executeQuery("SELECT COUNT(*) FROM INFORMATION_SCHEMA.SYSTEM_TABLES WHERE TABLE_NAME = '"
								+ tableName.toUpperCase() + "'");
				rs.next();
				boolean exists = rs.getInt(1) == 1;
				return exists;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			throw new UDCException(
					"Error occurred when checking whether a table exists: "
							+ e.getMessage());
		}

		// stupid compiler
		return false;
	}

}
