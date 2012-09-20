package org.curransoft.quadstream;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import org.geotools.data.FeatureSource;
import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.shapefile.shp.ShapefileException;
import org.geotools.feature.FeatureCollection;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;

public class Quadstream {
	String infile;
	String outfile;
	String tablePrefix;
	int levelOffset;
	int maxLevel;
	int level;

	/**
	 * C represents the set of critical vertices
	 */
	Set<Vertex> c = new HashSet<Vertex>();
	/**
	 * vertices represents for set of all unique vertices. A Map is used for
	 * conveniently aggregating duplicates.
	 */
	Map<Vertex, Vertex> vertices = new HashMap<Vertex, Vertex>();
	/**
	 * P represents the pool of unique vertices which are not critical.
	 */
	Set<Vertex> p = new HashSet<Vertex>();
	/**
	 * lv represents the vertices for the current level.
	 */
	List<Vertex> lv = new ArrayList<Vertex>();
	/**
	 * O represents the occupoed spots.
	 */
	List<Set<Integer>> o = new ArrayList<Set<Integer>>();
	Set<String> tables = new HashSet<String>();
	List<GeoBounds> polygonBounds = new ArrayList<GeoBounds>();
	GeoBounds globalBounds = new GeoBounds();
	PolygonGrid polygonGrid = new PolygonGrid();

	/**
	 * Used in getUniqueVertex() to avoid unnecessary object creation.
	 */
	Vertex temp = new Vertex(0, 0);

	double x, y, w, h;

	private double percentDoneReadingFile = 0;
	private double percentDoneQuadstream = 0;
	private boolean hasFailed = false;
	private String phase = "initializing";
	private String errorMessage = null;

	private BufferedWriter out;

	public Quadstream(String infile, String outfile, String tablePrefix,
			int levelOffset, int maxLevel) {
		this.infile = infile;
		this.outfile = outfile;
		this.levelOffset = levelOffset;
		this.maxLevel = maxLevel;
		this.tablePrefix = tablePrefix;
		for (int i = 0; i < maxLevel; i++)
			o.add(new HashSet<Integer>());
	}

	public void execute() {
		try {
			// store the "phase" of the algorithm for concurrent reporting
			phase = "reading shapefile";
			long t = System.currentTimeMillis();
			readInput();

			t = System.currentTimeMillis() - t;
			System.out.println("Reading took " + t + " ms.");

			phase = "simplifying polygons";
			t = System.currentTimeMillis();
			quadstream();
			t = System.currentTimeMillis() - t;
			System.out.println("quadstream took " + t + " ms.");
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			errorMessage = "File not found: " + e.getMessage();
			hasFailed = true;
		} catch (ShapefileException e) {
			e.printStackTrace();
			errorMessage = "Error reading shapefile: " + e.getMessage();
			hasFailed = true;
		} catch (IOException e) {
			errorMessage = "IO Error: " + e.getMessage();
			hasFailed = true;
			e.printStackTrace();
		}
	}

	private void quadstream() throws IOException {
		out = new BufferedWriter(new FileWriter(outfile));
		outputBounds();
		level = 0;
		for (Vertex v : c)
			stream(v);
		outputLevel();
		int d = 1;
		for (level = 0; level < maxLevel; level++, d *= 2) {
			Set<Integer> ol = o.get(level);
			for (Vertex v : p)
				if (!ol.contains(spot(v, d)))
					stream(v);
			outputLevel();
			percentDoneQuadstream = (double) level / (maxLevel - 1);
			phase = "simplifying level " + level + " of " + (maxLevel - 1);
		}
		out.close();
	}

	private void stream(Vertex v) {
		v.level = (level > 0 ? level : 1) - ((int) (Math.random() * 100))
				/ 100.0;
		lv.add(v);
		for (int l = 0, d = 1; l < maxLevel; l++, d *= 2)
			o.get(l).add(spot(v, d));
	}

	private int spot(Vertex v, int d) {
		// d = Math.pow(2,l)
		int i = (int) ((v.x - x) / w * d);
		int j = (int) ((v.y - y) / h * d);
		if (v.x >= x + w)
			i--;
		if (v.y >= y + h)
			j--;
		return i + d * j;
	}

	private void outputBounds() throws IOException {
		out.write("CREATE TABLE `"
				+ tablePrefix
				+ "bounds` (polygonId INTEGER,xMin FLOAT,yMin FLOAT,xMax FLOAT,yMax FLOAT);\n");
		String boundsStr = globalBounds.xMin + "," + globalBounds.yMin + ","
				+ globalBounds.xMax + "," + globalBounds.yMax;
		out.write("INSERT INTO `" + tablePrefix + "bounds` VALUES (-1,"
				+ boundsStr + ");\n");

		int n = polygonBounds.size();
		for (int polygonId = 0; polygonId < n; polygonId++) {
			GeoBounds b = polygonBounds.get(polygonId);
			boundsStr = b.xMin + "," + b.yMin + "," + b.xMax + "," + b.yMax;
			out.write("INSERT INTO `" + tablePrefix + "bounds` VALUES ("
					+ polygonId + "," + boundsStr + ");\n");
		}
	}

	private void outputLevel() throws IOException {
		p.removeAll(lv);

		int l = level - levelOffset;
		if (l >= 0) {
			polygonGrid.clear();
			int d = (int) Math.pow(2, l);
			for (Vertex v : lv)
				polygonGrid.add(spot(v, d), v);
			if (polygonGrid.vertices.size() > 0)
				encodeAsSQL(l, polygonGrid.vertices);
			lv.clear();
		}
	}

	private void encodeAsSQL(int l, Map<Integer, List<Vertex>> vertices)
			throws IOException {
		String tableName = tablePrefix + l;
		ensureTableExists(tableName);

		for (Entry<Integer, List<Vertex>> e : vertices.entrySet()) {
			int addr = e.getKey();
			List<Vertex> vertexList = e.getValue();
			String sql = "INSERT INTO `" + tableName + "` VALUES (" + addr
					+ ",\"";
			out.write(sql);
			int n = vertexList.size();
			for (int i = 0; i < n; i++) {
				Vertex v = vertexList.get(i);
				out.write(v.x + "," + v.y + "," + v.level + ",");
				int m = v.getNumMemberships();
				for (int j = 0; j < m; j++) {
					int polygonId = v.membershipPolygonIDs[j];
					int vertexId = v.membershipVertexIDs[j];
					out.write(polygonId + "," + vertexId
							+ (j == m - 1 ? "" : ","));
				}
				if (i < n - 1)
					out.write("\\n");
			}
			out.write("\");\n");
		}
	}

	private void ensureTableExists(String tableName) throws IOException {
		if (!tables.contains(tableName)) {
			out.write("CREATE TABLE `" + tableName
					+ "` (a INTEGER, v LONGTEXT);\n");
			tables.add(tableName);
		}
	}

	private void readInput() throws ShapefileException, MalformedURLException,
			IOException {
		FeatureCollection<SimpleFeatureType, SimpleFeature> featureCollection = null;
		Iterator<SimpleFeature> it = null;
		try {
			FileDataStore store = FileDataStoreFinder.getDataStore(new File(
					infile));
			FeatureSource<SimpleFeatureType, SimpleFeature> featureSource = store
					.getFeatureSource();
			featureCollection = featureSource.getFeatures();
			int n = featureCollection.size();
			int polygonId = 0;
			double i = 0;
			List<List<Vertex>> polygons = new ArrayList<List<Vertex>>();
			it = featureCollection.iterator();
			while (it.hasNext()) {
				SimpleFeature feature = it.next();

				polygons.clear();
				readGeometry(polygons, (Geometry) feature.getDefaultGeometry());
				for (List<Vertex> vertices : polygons) {
					int numVertices = vertices.size();
					if (numVertices > 2) {
						GeoBounds localBounds = new GeoBounds();
						polygonBounds.add(localBounds);
						for (int vertexId = 0; vertexId < numVertices; vertexId++) {
							Vertex a = vertices.get(vertexId);
							Vertex b = vertices.get((vertexId + 1)
									% numVertices);
							a.addMembership(polygonId, vertexId);
							expandBounds(a, localBounds);
							expandBounds(a, globalBounds);
							detectCriticalVertices(a, b);
						}
						polygonId++;
					}
				}
				percentDoneReadingFile = i++ / (n - 1);
			}
		} finally {
			if (featureCollection != null && it != null)
				featureCollection.close(it);
		}

		x = globalBounds.xMin;
		y = globalBounds.yMin;
		w = globalBounds.xMax - globalBounds.xMin;
		h = globalBounds.yMax - globalBounds.yMin;
	}

	private void detectCriticalVertices(Vertex a, Vertex b) {
		if (!a.equals(b)) {
			b.addAdjacentVertex(a);
			a.addAdjacentVertex(b);
			if (b.degree() == 3)
				c.add(b);
			if (a.degree() == 3)
				c.add(a);
		}
	}

	private Vertex getUniqueVertex(double x, double y) {
		temp.x = x;
		temp.y = y;
		Vertex v = vertices.get(temp);
		if (v == null) {
			v = new Vertex(temp.x, temp.y);
			vertices.put(v, v);
			p.add(v);
		}
		return v;
	}

	private void expandBounds(Vertex v, GeoBounds bounds) {
		double x = v.x;
		double y = v.y;
		if (x < bounds.xMin)
			bounds.xMin = x;
		if (x > bounds.xMax)
			bounds.xMax = x;
		if (y < bounds.yMin)
			bounds.yMin = y;
		if (y > bounds.yMax)
			bounds.yMax = y;
	}

	
	private void readGeometry(List<List<Vertex>> polygons, Geometry shape) {
		Coordinate[] coordinates = shape.getCoordinates();
		List<Vertex> polygon = new ArrayList<Vertex>();
		boolean firstPoint = true;
		double firstX = 0, firstY = 0;
		for (int i = 0; i < coordinates.length; i++) {
			Coordinate c = coordinates[i];
			if (c.x > 0)
				c.x -= 360;
			Vertex v = getUniqueVertex(c.x, c.y);
			if (firstPoint) {
				firstX = c.x;
				firstY = c.y;
				firstPoint = false;
				polygon.add(v);
			} else if (firstX == c.x && firstY == c.y) {
				if (polygon.size() != 0)
					polygons.add(polygon);
				polygon = new ArrayList<Vertex>();
				while (firstX == c.x && firstY == c.y
						&& i < coordinates.length - 1)
					c = coordinates[++i];
				i--;
				firstPoint = true;
			} else
				polygon.add(v);
		}
		if (polygon.size() != 0)
			polygons.add(polygon);
	}

	public int getPercentDone() {
		double timeReadingFile = 8000;
		double timeQuadstream = 8000;
		double timeTotal = timeReadingFile + timeQuadstream;
		return (int) (100 * (percentDoneReadingFile * timeReadingFile + percentDoneQuadstream
				* timeQuadstream) / timeTotal);
	}

	public String getPhase() {
		return phase;
	}

	public boolean hasFailed() {
		return hasFailed;
	}

	public String getErrorMessage() {
		return errorMessage;
	}
}

class PolygonGrid {
	Map<Integer, List<Vertex>> vertices = new HashMap<Integer, List<Vertex>>();

	public void clear() {
		vertices.clear();
	}

	public void add(int spot, Vertex v) {
		List<Vertex> list = vertices.get(spot);
		if (list == null)
			vertices.put(spot, list = new ArrayList<Vertex>());
		list.add(v);
	}
}