package org.ivpr.udc.core;

import java.util.Collection;
import java.util.List;

/**
 * A data cube is structurally characterized by a set of dimension instances and
 * a set of dimension instances. The cells of a data cube are defined by all
 * possible record prod- ucts in which one record is taken from each of the data
 * cube’s dimension instances. The content of data cube is the map- ping from
 * its cells to numeric values for each of its measure instances.
 * 
 * @author curran
 * 
 */
public interface DataCube extends UDCResource {
	/**
	 * Creates a new dimension instance with the given URI and level and adds it
	 * to this data cube
	 */
	public DimensionInstance createDimensionInstance(String uri, Level level);

	/**
	 * Lists the dimension instances of this data cube.
	 */
	public Collection<DimensionInstance> listDimensionInstances();

	/**
	 * Creates a new measure instance with the given URI and adds it to this
	 * data cube
	 */
	public MeasureInstance createMeasureInstance(String uri, Measure measure,
			Unit unit);

	/**
	 * Gets the measure instances of this data cube.
	 */
	public Collection<MeasureInstance> listMeasureInstances();

	/**
	 * Gets measure instance values for a single cell in this data cube.
	 * 
	 * @param cellLocation
	 *            The location of the cell in this data cube for which values
	 *            will be retrieved. This list must contain one record from each
	 *            dimension instance of the cube, and its ordering must be
	 *            consistent with that of the list returned by
	 *            listDimensionInstances().
	 * @param measureInstances
	 *            The measure instances for which values should be retrieved and
	 *            placed into the "result" array.
	 * @param result
	 *            The retrieved values are written into this array. The size of
	 *            this array must be the same as the size of the
	 *            "measureInstances" argument. The ordering of the resulting
	 *            values is consistent with that of the "measureInstances"
	 *            argument (value for measureInstances[i] goes in result[i]).
	 */
	public void getValues(List<Record> cellLocation,
			List<MeasureInstance> measureInstances, double[] result);

	/**
	 * Sets measure instance values for a single cell in this data cube.
	 * 
	 * @param cellLocation
	 *            The location of the cell in this data cube for which values
	 *            will be retrieved. This list must contain one record from each
	 *            dimension instance of the cube, deriving its ordering from the
	 *            list of dimension instances returned by
	 *            listDimensionInstances().
	 * @param measureInstances
	 *            The measure instances for which values should be retrieved and
	 *            placed into the "result" array.
	 * @param values
	 *            The vDataCubeDataalues in this array will be read and stored
	 *            in this data cube. The size of this array must be the same as
	 *            the size of the "measureInstances" argument. The ordering of
	 *            the resulting values is consistent with that of
	 *            "measureInstances" (value for measureInstances[i] comes from
	 *            values[i]).
	 */
	public void setValues(List<Record> cellLocation,
			List<MeasureInstance> measureInstances, double[] values);

	/**
	 * Creates a projection of this data cube.
	 * 
	 * @param dimensionInstances
	 *            A list of dimension instances specifying which records to
	 *            include in the projection. The size and ordering of this list
	 *            must be consistent with that returned by
	 *            listDimensionInstances().
	 * @param measureInstances
	 *            A list specifying which measure instances to include in the
	 *            projection.
	 * @return A data cube which contains the specified projection.
	 */
	public DataCube project(List<DimensionInstance> dimensionInstances,
			List<MeasureInstance> measureInstances);
}
