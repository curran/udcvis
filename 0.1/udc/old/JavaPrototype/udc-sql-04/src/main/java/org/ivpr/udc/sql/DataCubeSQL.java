package org.ivpr.udc.sql;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import org.ivpr.udc.core.DataCube;
import org.ivpr.udc.core.DimensionInstance;
import org.ivpr.udc.core.Level;
import org.ivpr.udc.core.Measure;
import org.ivpr.udc.core.MeasureInstance;
import org.ivpr.udc.core.Record;
import org.ivpr.udc.core.UDCException;
import org.ivpr.udc.core.UDCResource;
import org.ivpr.udc.core.Unit;

import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.StmtIterator;
import com.hp.hpl.jena.vocabulary.RDF;

public class DataCubeSQL extends UDCResourceSQL implements DataCube {
	/**
	 * The name of the resource table mappint URIs to integer ids.
	 */
	protected final String resourcesTableName = "resources";

	/**
	 * The id of this cube.
	 */
	final long cubeId;

	/**
	 * The name of the sql table which contains the contents of this cube.
	 */
	final String cubeTable;

	public DataCubeSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
		cubeId = resourceId(resource.getURI());
		cubeTable = "c" + cubeId;
	}

	@Override
	public void delete() {
		// TODO Auto-generated method stub

	}

	@Override
	public DimensionInstance createDimensionInstance(String uri, Level level) {
		Resource dimensionInstance = model.jenaModel().createResource(uri);
		dimensionInstance.addProperty(RDF.type, UDC.DimensionInstance);

		Resource dataCube = this.resource;
		dataCube.addProperty(UDC.containsDimensionInstance, dimensionInstance);
		dimensionInstance.addProperty(UDC.inDimesion, dataCube);
		Resource levelResource = model.jenaModel().createResource(level.uri());
		dimensionInstance.addProperty(UDC.hasLevel, levelResource);

		return new DimensionInstanceSQL(dimensionInstance, model);
	}

	@Override
	public MeasureInstance createMeasureInstance(String uri, Measure measure,
			Unit unit) {
		Resource measureInstance = model.jenaModel().createResource(uri);
		measureInstance.addProperty(RDF.type, UDC.MeasureInstance);

		Resource dataCube = this.resource;
		dataCube.addProperty(UDC.containsMeasureInstance, measureInstance);
		measureInstance.addProperty(UDC.inDimesion, dataCube);

		Resource unitResource = model.jenaModel().createResource(unit.uri());
		measureInstance.addProperty(UDC.hasUnit, unitResource);

		return new MeasureInstanceSQL(measureInstance, model);
	}

	@Override
	public Collection<DimensionInstance> listDimensionInstances() {
		StmtIterator i = resource.listProperties(UDC.containsDimensionInstance);
		Collection<DimensionInstance> dimensionInstances = new LinkedList<DimensionInstance>();
		for (; i.hasNext();) {
			String uri = i.nextStatement().getObject().asResource().getURI();
			dimensionInstances.add(model.getDimensionInstance(uri));
		}
		i.close();
		return dimensionInstances;
	}

	@Override
	public Collection<MeasureInstance> listMeasureInstances() {
		StmtIterator i = resource.listProperties(UDC.containsMeasureInstance);
		Collection<MeasureInstance> measureInstances = new LinkedList<MeasureInstance>();
		for (; i.hasNext();) {
			String uri = i.nextStatement().getObject().asResource().getURI();
			measureInstances.add(model.getMeasureInstance(uri));
		}
		i.close();
		return measureInstances;
	}

	public void getValues(List<Record> cellLocation,
			List<MeasureInstance> measureInstances, double[] result) {
		try {
			Connection c = model.dataSource.getConnection();
			Statement s = c.createStatement();
			StringBuilder selectSQL = new StringBuilder();
			StringBuilder clauseSQL = new StringBuilder();

			for(Record record:cellLocation){
				long levelId = resourceId(record.level());
				long recordId = resourceId(record);
				clauseSQL.append("l" + levelId + "=" + recordId + " AND ");
			}
			clauseSQL.setLength(clauseSQL.length() - 5);

			int n = measureInstances.size();
			for (int i = 0; i < n; i++) {
				MeasureInstance mi = measureInstances.get(i);
				selectSQL.append("mi" + resourceId(mi.uri()) + ",");
			}
			selectSQL.setLength(selectSQL.length() - 1);

			String query = "SELECT " + selectSQL + " FROM " + cubeTable
					+ " WHERE " + clauseSQL;
//			System.out.println("get query = "+query);
			ResultSet rs = s.executeQuery(query);
			if (rs.next())
				for (int i = 0; i < n; i++) 
					result[i] = rs.getDouble(i+1);
		} catch (SQLException e) {
			throw new UDCException(
					"Error while setting data cube cell values: "
							+ e.getMessage());
		}

	}

	private long resourceId(UDCResource resource) {
		return resourceId(resource.uri());
	}

	@Override
	public DataCube project(List<DimensionInstance> dimensionInstances,
			List<MeasureInstance> measureInstances) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setValues(List<Record> cellLocation,
			List<MeasureInstance> measureInstances, double[] values) {
		try {
			Connection c = model.dataSource.getConnection();
			if (!SQLUtils.tableExists(c, cubeTable)) {
				createCubeTable(c);
				c.close();
				setValues(cellLocation, measureInstances, values);
			} else {
				Statement s = c.createStatement();
				StringBuilder columnsSQL = new StringBuilder();
				StringBuilder valuesSQL = new StringBuilder();

				for (Record record : cellLocation) {
					Level l = record.level();
					columnsSQL.append("l" + resourceId(l.uri()) + ",");
					valuesSQL.append(resourceId(record.uri()) + ",");
				}

				int n = measureInstances.size();
				if (n != values.length)
					throw new UDCException("Length of values (" + values.length
							+ ") does not match that of measureInstances (" + n
							+ ")");
				for (int i = 0; i < n; i++) {
					MeasureInstance mi = measureInstances.get(i);
					columnsSQL.append("mi" + resourceId(mi.uri()) + ",");
					valuesSQL.append(values[i] + ",");
				}
				columnsSQL.setLength(columnsSQL.length() - 1);
				valuesSQL.setLength(valuesSQL.length() - 1);

				String query = "INSERT INTO " + cubeTable + " ("
						+ columnsSQL.toString() + ") VALUES ("
						+ valuesSQL.toString() + ")";
//				System.out.println("set query = " + query);
				s.executeQuery(query);
			}

		} catch (SQLException e) {
			throw new UDCException(
					"Error while setting data cube cell values: "
							+ e.getMessage());
		}

	}

	private void createCubeTable(Connection c) throws SQLException {
		Statement s = c.createStatement();

		StringBuilder columns = new StringBuilder();

		for (DimensionInstance di : listDimensionInstances())
			columns.append("l" + resourceId(di.level().uri()) + " INT,");

		String levelColumns = columns.toString();

		columns.setLength(0);
		for (MeasureInstance mi : listMeasureInstances())
			columns.append("mi" + resourceId(mi.uri()) + " NUMERIC,");
		columns.setLength(columns.length() - 1);// remove the last comma

		String measureColumns = columns.toString();
		s.execute("CREATE TABLE " + cubeTable + " (" + levelColumns
				+ measureColumns + ")");
		s.close();
	}

	/**
	 * Gets the given resource id
	 * 
	 * @param uri
	 * @return
	 */
	protected long resourceId(String uri) {
		try {
			Connection c = model.dataSource.getConnection();
			long id = resourceId(uri, c);
			c.close();
			return id;
		} catch (SQLException e) {
			throw new UDCException("Error while retreiving a resource ID: "
					+ e.getMessage(), e);
		}
	}

	private long resourceId(String uri, Connection c) {
		try {
			String query = "SELECT id FROM " + resourcesTableName
					+ " WHERE uri='" + uri + "'";
			ResultSet r = c.createStatement().executeQuery(query);
			if (r.next())
				return r.getLong(1);
			else {
				// No id for thsi uri, so create one
				Statement st = c.createStatement();
				st.executeQuery("INSERT INTO " + resourcesTableName
						+ " (uri) VALUES ('" + uri + "')");
				return resourceId(uri, c);
			}
		} catch (SQLException e) {
			// the exception may be caused by the "resources" table not
			// existing.
			// In this case, create it and try again
			if (!SQLUtils.tableExists(c, resourcesTableName)) {
				createTables(c);
				return resourceId(uri, c);
			} else
				throw new UDCException("Error while retreiving a resource ID: "
						+ e.getMessage(), e);
		}
	}

	/**
	 * Creates the resources and recordTopology tables.
	 */
	private void createTables(Connection c) {
		if (!SQLUtils.tableExists(c, resourcesTableName)) {
			try {
				Statement s = c.createStatement();
				s.execute("CREATE TABLE " + resourcesTableName
						+ " (id BIGINT IDENTITY,uri VARCHAR)");
				s.close();
			} catch (SQLException e) {
				throw new UDCException("Error while creating resources table: "
						+ e.getMessage(), e);
			}
		} else
			throw new UDCException(
					"Error: attempted to create resources table when it already exists!");
	}
}
