import java.io.File;
import java.io.IOException;

import org.geotools.data.FeatureSource;
import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.map.DefaultMapContext;
import org.geotools.map.MapContext;
import org.geotools.swing.JMapFrame;
import org.geotools.swing.data.JFileDataStoreChooser;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// display a data store file chooser dialog for shapefiles
		File file = JFileDataStoreChooser.showOpenFile("shp", null);
		if (file == null) {
			return;
		}

		FileDataStore store;
		try {
			store = FileDataStoreFinder.getDataStore(file);
			FeatureSource featureSource = store.getFeatureSource();

			// Create a map context and add our shapefile to it
			MapContext map = new DefaultMapContext();
			map.setTitle("Quickstart");
			map.addLayer(featureSource, null);

			// Now display the map
			JMapFrame.showMap(map);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
