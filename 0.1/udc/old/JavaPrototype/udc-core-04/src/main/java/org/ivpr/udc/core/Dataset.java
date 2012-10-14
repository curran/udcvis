package org.ivpr.udc.core;

import java.util.Collection;

/**
 * A dataset is a collection of related data cubes from the same data provider.
 * 
 * @author curran
 * 
 */
public interface Dataset extends DCResource {
	/**
	 * Creates an empty data cube with the given URI and adds it to this data
	 * set.
	 */
	public DataCube createDataCube(String uri);

	/**
	 * Lists all data cubes in this data set.
	 */
	public Collection<DataCube> listDataCubes();
}
