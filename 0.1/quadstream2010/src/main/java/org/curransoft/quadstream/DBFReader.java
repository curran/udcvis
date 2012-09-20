package org.curransoft.quadstream;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;

import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.feature.FeatureCollection;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.feature.type.AttributeDescriptor;

public class DBFReader {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String path = "/home/curran/data/shapes/us/states/tiger_line/tl_2009_us_state.shp";
		FeatureCollection<SimpleFeatureType, SimpleFeature> featureCollection = null;
		Iterator<SimpleFeature> it = null;
		try {
			FileDataStore store = FileDataStoreFinder.getDataStore(new File(
					path));
			for (AttributeDescriptor d:store.getSchema().getAttributeDescriptors())
				System.out.println(d.getLocalName());
			
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (featureCollection != null && it != null)
				featureCollection.close(it);
		}
	}

}
