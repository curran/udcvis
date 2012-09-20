package org.curransoft.quadstream;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import flexjson.JSONSerializer;

@SuppressWarnings("serial")
public class ShapeServlet extends HttpServlet {
	private ShapesConfigManager configs;
	private String errorMessage = null;
	JSONSerializer infoSerializer = new JSONSerializer().exclude("*.class",
			"sqlDatabase", "sqlUser", "sqlPassword", "sqlQuery",
			"sqlTablePrefix");

	public void init(ServletConfig config) throws ServletException {
		configs = ShapesConfigManager.getInstance();
		if (!configs.isInitialized())
			errorMessage = configs.initialize();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		PrintWriter out = response.getWriter();

		String q = request.getParameter("q");
		if (q == null)
			errorMessage = "Parameter 'q' must be specified. Possible values are 'shapes' and 'info'";

		else if ("shapes".equals(q)) {
			String dataId = requireParam("d", "A dataset ID", q, request);
			String level = requireParam("l", "A level", q, request);
			String address = requireParam("a", "An address", q, request);
			if (errorMessage == null)
				getShapes(out, dataId, level, address);

		} else if ("bounds".equals(q)) {
			String dataId = requireParam("d", "A dataset ID", q, request);
			if (errorMessage == null)
				getBounds(out, dataId);

		} else if ("info".equals(q)) {
			String dataId = requireParam("d", "A dataset ID", q, request);
			if (errorMessage == null)
				out.print(infoSerializer.serialize(configs.getConfig(dataId)));

		} else if ("list".equals(q))
			out.print(infoSerializer.serialize(configs.getAllConfigIds()));

		if (errorMessage != null) {
			out.write(errorMessageAsJSON());
			errorMessage = null;
		}
		out.flush();
		out.close();
	}

	private void getShapes(PrintWriter out, String dataId, String level,
			String address) {
		ShapesConfig conf = configs.getConfig(dataId);
		Connection con = null;
		try {
			con = configs.getConnection(conf);
			String sqlTable = conf.sqlTablePrefix + level;
			if (tableExists(con, sqlTable)) {
				Statement stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery("select v from " + sqlTable
						+ " where a = " + address);
				if (rs.next())
					out.print(rs.getString("v"));
			}
		} catch (SQLException e) {
			errorMessage = "Database error: " + e.getMessage();
		} finally {
			if (con != null)
				try {
					con.close();
				} catch (SQLException e) {
				}
		}
	}

	public void getBounds(PrintWriter out, String dataId) {
		ShapesConfig conf = configs.getConfig(dataId);
		Connection con = null;
		try {
			con = configs.getConnection(conf);
			Statement stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery("select * from "
					+ conf.getSqlTablePrefix() + "bounds");
			while (rs.next()) {
				out.print(rs.getString(1) + "," + rs.getString(2) + ","
						+ rs.getString(3) + "," + rs.getString(4) + ","
						+ rs.getString(5));
				if (!rs.isLast())
					out.print("\n");
			}

		} catch (SQLException e) {
			errorMessage = "Database error while accessing shapes: "
					+ e.getMessage();
			e.printStackTrace();
		} finally {
			if (con != null)
				try {
					con.close();
				} catch (SQLException e) {
				}
		}
	}

	private boolean tableExists(Connection conn, String sqlTable)
			throws SQLException {
		Statement smt = conn.createStatement();
		ResultSet res = smt.executeQuery("show tables like \"" + sqlTable
				+ "\"");
		res.beforeFirst();
		res.last();
		boolean tableExists = res.getRow() == 1;
		return tableExists;
	}

	private String errorMessageAsJSON() {
		return "{\"error\":\"" + errorMessage.replace("\n", " ") + "\"}";
	}

	private String requireParam(String parameter, String errorPrefix, String q,
			HttpServletRequest request) {
		String p = request.getParameter(parameter);
		if (p == null)
			this.errorMessage = errorPrefix + " (parameter '" + parameter
					+ "') must be specified when requesting '" + q + "'.";
		return p;
	}

}