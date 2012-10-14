package org.ivpr.udc.sql;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collection;
import java.util.LinkedList;

import javax.sql.DataSource;

import org.ivpr.udc.core.AggregationOperator;
import org.ivpr.udc.core.DataCube;
import org.ivpr.udc.core.Dataset;
import org.ivpr.udc.core.Dimension;
import org.ivpr.udc.core.DimensionInstance;
import org.ivpr.udc.core.InternationalString;
import org.ivpr.udc.core.Level;
import org.ivpr.udc.core.Measure;
import org.ivpr.udc.core.MeasureInstance;
import org.ivpr.udc.core.Quantity;
import org.ivpr.udc.core.Record;
import org.ivpr.udc.core.UDCException;
import org.ivpr.udc.core.UDCModel;
import org.ivpr.udc.core.Unit;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.StmtIterator;
import com.hp.hpl.jena.sdb.SDBFactory;
import com.hp.hpl.jena.sdb.Store;
import com.hp.hpl.jena.sdb.StoreDesc;
import com.hp.hpl.jena.sdb.store.DatabaseType;
import com.hp.hpl.jena.sdb.store.DatasetStore;
import com.hp.hpl.jena.sdb.store.LayoutType;
import com.hp.hpl.jena.sdb.util.StoreUtils;
import com.hp.hpl.jena.vocabulary.RDF;

public class UDCModelSQL implements UDCModel {

	DataSource dataSource;
	Model jenaModel;
	com.hp.hpl.jena.query.Dataset data;
	public UDCModelSQL(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	protected Model jenaModel() {
		if (jenaModel == null)
			try {
				StoreDesc storeDesc = new StoreDesc(
						LayoutType.LayoutTripleNodesHash, DatabaseType.HSQLDB);
				Connection conn = dataSource.getConnection();
				Store store = SDBFactory.connectStore(conn, storeDesc);
				if (!StoreUtils.isFormatted(store))
					store.getTableFormatter().create();
				jenaModel = SDBFactory.connectDefaultModel(store);
				data = DatasetStore.create(store);
			} catch (SQLException e) {
				e.printStackTrace();
				throw new UDCException("Error while accessing knowledge base: "
						+ e.getMessage());
			}
		return jenaModel;
	}

	public Dimension createDimension(String uri, InternationalString name) {
		Resource dimension = jenaModel().createResource(uri);
		dimension.addProperty(RDF.type, UDC.Dimension);
		DimensionSQL dimensionSQL = new DimensionSQL(dimension, this);
		dimensionSQL.setName(name);
		return dimensionSQL;
	}

	@Override
	public AggregationOperator createAggregationOperator(String uri,
			InternationalString name) {
		Resource aggregationOperator = jenaModel().createResource(uri);
		aggregationOperator.addProperty(RDF.type, UDC.AggregationOperator);
		AggregationOperatorSQL aggregationOperatorSQL = new AggregationOperatorSQL(aggregationOperator, this);
		aggregationOperatorSQL.setName(name);
		return aggregationOperatorSQL;
	}

	@Override
	public Dataset createDataset(String uri, InternationalString name) {
		Resource dataset = jenaModel().createResource(uri);
		dataset.addProperty(RDF.type, UDC.Dataset);
		DatasetSQL datasetSQL = new DatasetSQL(dataset, this);
		datasetSQL.setName(name);
		return datasetSQL;
	}

	@Override
	public Measure createMeasure(String uri, InternationalString name,
			Quantity quantity, AggregationOperator aggregationOperator) {
		Model m = jenaModel();
		Resource measure = m.createResource(uri);
		measure.addProperty(RDF.type, UDC.Measure);
		measure.addProperty(UDC.hasQuantity, m.createResource(quantity.uri()));
		measure.addProperty(UDC.hasAggregationOperator, m.createResource(aggregationOperator.uri()));
		MeasureSQL measureSQL = new MeasureSQL(measure, this);
		measureSQL.setName(name);
		return measureSQL;
	}

	@Override
	public Quantity createQuantity(String uri, InternationalString name) {
		Resource quantity = jenaModel().createResource(uri);
		quantity.addProperty(RDF.type, UDC.Quantity);
		QuantitySQL quantitySQL = new QuantitySQL(quantity, this);
		quantitySQL.setName(name);
		return quantitySQL;
	}

	@Override
	public AggregationOperator getAggregationOperator(String uri) {
		return new AggregationOperatorSQL(jenaModel().createResource(uri), this);

	}

	@Override
	public DataCube getDataCube(String uri) {
		return new DataCubeSQL(jenaModel().createResource(uri), this);

	}

	@Override
	public Dataset getDataset(String uri) {
		return new DatasetSQL(jenaModel().createResource(uri), this);

	}

	@Override
	public Dimension getDimension(String uri) {
		return new DimensionSQL(jenaModel().createResource(uri), this);

	}

	@Override
	public DimensionInstance getDimensionInstance(String uri) {
		return new DimensionInstanceSQL(jenaModel().createResource(uri), this);

	}

	@Override
	public Collection<DataCube> getHierarchicalDataCube(
			Collection<Dimension> dimensions, Collection<Measure> measures) {
		return null;
	}

	@Override
	public Level getLevel(String uri) {
		return new LevelSQL(jenaModel().createResource(uri), this);
	}

	@Override
	public Record getRecord(String uri) {
		return new RecordSQL(jenaModel().createResource(uri), this);
	}

	@Override
	public Measure getMeasure(String uri) {
		return new MeasureSQL(jenaModel().createResource(uri), this);
	}

	@Override
	public MeasureInstance getMeasureInstance(String uri) {
		return new MeasureInstanceSQL(jenaModel().createResource(uri), this);
	}

	@Override
	public Quantity getQuantity(String uri) {
		return new QuantitySQL(jenaModel().createResource(uri), this);

	}

	@Override
	public Unit getUnit(String uri) {
		return new UnitSQL(jenaModel().createResource(uri), this);

	}

	@Override
	public Collection<AggregationOperator> listAggregationOperators() {
		return null;
	}

	@Override
	public Collection<DataCube> listDataCubes() {
		StmtIterator i = jenaModel().listStatements(null, RDF.type, UDC.DataCube);
		Collection<DataCube> dataCubes = new LinkedList<DataCube>();
		for (; i.hasNext();) {
			String uri = i.nextStatement().getObject().asResource().getURI();
			dataCubes.add(getDataCube(uri));
		}
		i.close();
		return dataCubes;
	}

	@Override
	public Collection<DataCube> listDataCubesByDimensions(
			Collection<Dimension> dimension) {
		return null;
	}

	@Override
	public Collection<DataCube> listDataCubesByLevels(Collection<Level> level) {
		return null;
	}

	@Override
	public Collection<DataCube> listDataCubesByMeasures(
			Collection<Measure> measure) {
		return null;

	}

	@Override
	public Collection<Dataset> listDatasets() {
		return null;
	}

	@Override
	public Collection<Dimension> listDimensions() {
		return null;

	}

	@Override
	public Collection<Measure> listMeasures() {
		return null;
	}

	@Override
	public Collection<Quantity> listQuantities() {
		return null;
	}

}
