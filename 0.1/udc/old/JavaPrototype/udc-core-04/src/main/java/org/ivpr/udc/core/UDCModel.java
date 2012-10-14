package org.ivpr.udc.core;

import java.util.Collection;

/**
 * The Universal Data Cube Model API specification.
 * 
 * @author curran
 * 
 */
public interface UDCModel {
	/**
	 * Creates a new dimension with the given URI and name
	 */
	public Dimension createDimension(String uri,InternationalString name);

	/**
	 * Looks up a dimension by URI
	 */
	public Dimension getDimension(String uri);

	/**
	 * Lists all dimensions in this model.
	 */
	public Collection<Dimension> listDimensions();
	
	/**
	 * Looks up a level by URI
	 */
	public Level getLevel(String uri);
	/**
	 * Looks up a record by URI
	 */
	public Record getRecord(String uri);

	/**
	 * Creates a new measure with the given URI
	 */
	public Measure createMeasure(String uri, InternationalString name,
			Quantity quantity, AggregationOperator aggregationOperator);

	/**
	 * Looks up a measure by URI
	 */
	public Measure getMeasure(String uri);

	/**
	 * Lists all measures in this model.
	 */
	public Collection<Measure> listMeasures();

	/**
	 * Creates an aggregation operator with the given URI
	 */
	public AggregationOperator createAggregationOperator(String uri,
			InternationalString name);

	/**
	 * Looks up a aggregation operator by URI
	 */
	public AggregationOperator getAggregationOperator(String uri);

	/**
	 * Lists all aggregation operators in this model.
	 */
	public Collection<AggregationOperator> listAggregationOperators();

	/**
	 * Creates an quantity with the given URI
	 */
	public Quantity createQuantity(String uri, InternationalString name);

	/**
	 * Looks up a quantity by URI
	 */
	public Quantity getQuantity(String uri);

	/**
	 * Lists all quantities in this model.
	 */
	public Collection<Quantity> listQuantities();

	/**
	 * Looks up a unit by URI
	 */
	public Unit getUnit(String uri);

	/**
	 * Creates a new dataset with the given URI.
	 */
	public Dataset createDataset(String uri, InternationalString name);

	/**
	 * Looks up a dataset by URI
	 */
	public Dataset getDataset(String uri);

	/**
	 * Lists all datasets in this model.
	 */
	public Collection<Dataset> listDatasets();

	/**
	 * Looks up a data cube by URI
	 */
	public DataCube getDataCube(String uri);

	/**
	 * Lists all data cubes in this model.
	 */
	public Collection<DataCube> listDataCubes();

	/**
	 * Returns the collection of data cube instances which are part of the
	 * hierarchical data cube specified by the given set of dimensions and
	 * measures.
	 */
	public Collection<DataCube> getHierarchicalDataCube(
			Collection<Dimension> dimensions, Collection<Measure> measures);

	/**
	 * Returns the collection of data cubes which contain instances of the
	 * specified measures.
	 */
	public Collection<DataCube> listDataCubesByMeasures(
			Collection<Measure> measure);

	/**
	 * Returns the collection of data cubes which contain instances of the
	 * specified dimensions.
	 */
	public Collection<DataCube> listDataCubesByDimensions(
			Collection<Dimension> dimension);

	/**
	 * Returns the collection of data cubes which contain dimension instances
	 * representing the specified levels.
	 */
	public Collection<DataCube> listDataCubesByLevels(Collection<Level> level);

	/**
	 * Looks up a dimension instance by URI
	 */
	public DimensionInstance getDimensionInstance(String uri);

	/**
	 * Looks up a measure instance by URI
	 */
	public MeasureInstance getMeasureInstance(String uri);
}