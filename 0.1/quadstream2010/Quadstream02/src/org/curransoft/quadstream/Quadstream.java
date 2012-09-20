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
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.geotools.data.FeatureSource;
import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.shapefile.shp.ShapefileException;
import org.geotools.feature.FeatureCollection;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;

/**
 * The class responsible for executing the Quadstream algorithm. To use it,
 * create a new instance and call execute() on it. For concurrent reporting,
 * call getPercentDone() and hasFailed() from another thread while execute() is
 * running.
 * 
 * @author curran
 * 
 */
public class Quadstream {
	// TODO get rid of this, use many files instead
	public final String outFileName = "vertices.sql", tablePrefix = "us";
	/**
	 * the path of the input .shp file
	 */
	String infile;

	/**
	 * the path to the directory into which the output files will go
	 */
	String outDirectory;
	/**
	 * TODO add comment
	 */
	int levelOffset;
	/**
	 * TODO add comment
	 */
	int maxLevel;
	/**
	 * TODO add comment
	 */
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
	 * O represents the occupied spots. The indices of this list represent
	 * levels.
	 */
	List<Set<Integer>> o = new ArrayList<Set<Integer>>();

	Set<String> tables = new HashSet<String>();

	List<GeoBounds> polygonBounds = new ArrayList<GeoBounds>();

	GeoBounds globalBounds = new GeoBounds();

	VertexBinGrid polygonGrid = new VertexBinGrid();

	/**
	 * Used in getUniqueVertex() to avoid unnecessary object creation.
	 */
	Vertex temp = new Vertex(0, 0);

	/**
	 * The global bounds of the bounding rectangle (fits all vertices). These
	 * values are set in readInput() and do not change after that.
	 */
	double x, y, w, h;

	/**
	 * The percentage of the file which has so far been read.
	 */
	private double percentDoneReadingFile = 0;
	/**
	 * The percentage of the processing which has so far been done for the
	 * Quadstream simplification algorithm.
	 */
	private double percentDoneQuadstream = 0;
	/**
	 * A flag set to true when the algorithm somehow fails. (this should never
	 * happen)
	 */
	private boolean hasFailed = false;
	/**
	 * A human-readable string indicating which phase of the algorithm this
	 * Quadstream instance is currently in.
	 */
	private String phase = "initializing";
	/**
	 * An error message which will be set whenever hasFailed==true.
	 */
	private String errorMessage = null;

	/**
	 * Creates a new Quadstream object, ready to read and simplify shapes.
	 * 
	 * You need to call execute() in order for processing to begin.
	 * 
	 * Before you do so, you might want to set up a progress monitoring thread,
	 * which should call
	 * 
	 * @param infile
	 *            the path of the input .shp file
	 * @param outDirectory
	 *            the path to the directory into which the output files will go
	 * @param levelOffset
	 * @param maxLevel
	 */
	public Quadstream(String infile, String outDirectory, int levelOffset,
			int maxLevel) {
		this.infile = infile;
		this.outDirectory = outDirectory;
		this.levelOffset = levelOffset;
		this.maxLevel = maxLevel;
		for (int i = 0; i < maxLevel; i++)
			o.add(new HashSet<Integer>());
	}

	/**
	 * Call this method to execute the Quadstream process. This may be long
	 * running. For concurrent reporting, call getPercentDone() and hasFailed()
	 * periodically from another thread while execute() is running.
	 */
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

	/**
	 * Reads the input file. Refers to the following members:
	 * 
	 * infile
	 * 
	 * Has the following side effects:
	 * 
	 * adds things to polygonBounds
	 * 
	 * writes to percentDoneReadingFile
	 * 
	 * writes to x,y,w,h
	 * 
	 * @throws ShapefileException
	 * @throws MalformedURLException
	 * @throws IOException
	 */
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

	/**
	 * Generates the output file.
	 */
	private void quadstream() throws IOException {
		BufferedWriter out = new BufferedWriter(new FileWriter(outDirectory));
		outputBounds(out);
		level = 0;
		for (Vertex v : c)
			stream(v);
		outputLevel(out);
		int d = 1;
		for (level = 0; level < maxLevel; level++, d *= 2) {
			Set<Integer> ol = o.get(level);
			for (Vertex v : p)
				if (!ol.contains(getBinAddress(v, d)))
					stream(v);
			outputLevel(out);
			percentDoneQuadstream = (double) level / (maxLevel - 1);
			phase = "simplifying level " + level + " of " + (maxLevel - 1);
		}
		out.close();
	}

	private void stream(Vertex v) {
		// randomize the intra-level distribution for smoothest incremental
		// resolution enhancement (looks much better when zooming - no big jumps
		// in vertex density).
		v.level = (level > 0 ? level : 1) - ((int) (Math.random() * 100))
				/ 100.0;
		// add the vertex to the vertices of the current level
		lv.add(v);

		// l represents the level
		// d represents 2^l
		for (int l = 0, d = 1; l < maxLevel; l++, d *= 2)
			o.get(l).add(getBinAddress(v, d));
	}

	/**
	 * Determines which bin the given vertex is in (in the dXd grid spanning
	 * over the bounding rectangle) and returns the integer (level-local)
	 * address for that bin.
	 */
	private int getBinAddress(Vertex v, int d) {
		// What's d? d = 2^l
		// [i,j] represents coordinates in a dXd grid spanning over the (wXh)
		// rectangle.
		int i = (int) ((v.x - x) / w * d);
		int j = (int) ((v.y - y) / h * d);

		// TODO figure out this code
		if (v.x >= x + w)
			i--;
		if (v.y >= y + h)
			j--;

		// return a single integer which can be used to address the "spot" or
		// "bin" (in the level-specific dXd grid) which the given vertex v falls
		// in.
		return i + d * j;
	}

	/**
	 * Calls: b.addAdjacentVertex(a); a.addAdjacentVertex(b);
	 * 
	 * If either a or b is a critical vertex (its degree is greater than 3), it
	 * is added to c.
	 */
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

	/**
	 * Outputs the SQL necessary to create the bounds table and insert the
	 * global bounds value into.
	 */
	private void outputBounds(BufferedWriter out) throws IOException {
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

	/**
	 * Removes all lv from p.
	 * 
	 * Clears polygonGrid.
	 * 
	 * Adds all vertices in lv to polygonGrid.
	 * 
	 * calls encodeAsSQL()
	 */
	private void outputLevel(BufferedWriter out) throws IOException {
		p.removeAll(lv);

		int l = level - levelOffset;
		if (l >= 0) {
			polygonGrid.clear();
			int d = (int) Math.pow(2, l);
			for (Vertex v : lv)
				polygonGrid.add(getBinAddress(v, d), v);
			if (polygonGrid.verticesInBins.size() > 0)
				encodeAsSQL(out, l, polygonGrid.verticesInBins);
			lv.clear();
		}
	}

	private void encodeAsSQL(BufferedWriter out, int l,
			Map<Integer, List<Vertex>> vertices) throws IOException {
		String tableName = tablePrefix + l;
		ensureTableExists(out, tableName);

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

	private void ensureTableExists(BufferedWriter out, String tableName)
			throws IOException {
		if (!tables.contains(tableName)) {
			out.write("CREATE TABLE `" + tableName
					+ "` (a INTEGER, v LONGTEXT);\n");
			tables.add(tableName);
		}
	}

	/**
	 * If "v" falls outside of "bounds", "bounds" is expanded to fit v inside.
	 * 
	 * @param v
	 *            the vertex to expand the bounds to fit
	 * @param bounds
	 *            mutated as a side effect
	 */
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

	/**
	 * 
	 * @param polygons
	 *            this is manipulated as a side effect. It is expected to be
	 *            empty when this method is called.
	 * @param shape
	 *            the Geometry to extract the vertices from
	 */
	private void readGeometry(List<List<Vertex>> polygons, Geometry shape) {
		if (!polygons.isEmpty())
			throw new IllegalArgumentException(
					"The polygons list must be empty before calling readGeometry()!");
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

	/**
	 * If a vertex with the given coordinates has already been encountered, the
	 * Vertex instance created previously will be returned. Itherwise, a new
	 * Vertex is created and returned.
	 */
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

	/**
	 * Returns a string describing the current activity within the Quadstream
	 * process. Could be "initializing", "reading shapefile" or something like
	 * "simplifying level 6 of 15"
	 */
	public String getPhase() {
		return phase;
	}

	/**
	 * Returns true if the call to execute() somehow failed. If this returns
	 * true, call getErrorMessage() to find out what happened.
	 */
	public boolean hasFailed() {
		return hasFailed;
	}

	/**
	 * Returns a descriptive error message when something goes wrong. Calling
	 * this only makes sense after hasFailed() returns true.
	 */
	public String getErrorMessage() {
		return errorMessage;
	}

	/**
	 * Gets the approximate percentage of how much the Quadstream process has
	 * progressed. It only makes sense to call this method to check progress
	 * while execute() is running.
	 */
	public int getPercentDone() {
		double timeReadingFile = 8000;
		double timeQuadstream = 8000;
		double timeTotal = timeReadingFile + timeQuadstream;
		return (int) (100 * (percentDoneReadingFile * timeReadingFile + percentDoneQuadstream
				* timeQuadstream) / timeTotal);
	}
}

/**
 * A sparse grid of 2D bins and the vertices which fall in them. It only makes
 * sense to use vertices from the same level within a VertexBinGrid instance,
 * because the bin address is actually only relevant for a single level. However
 * a VertexBinGrid instance can be reused for many different levels by calling
 * clear().
 */
class VertexBinGrid {
	/**
	 * Keys represent bin addresses ("spots"), values represent the collections
	 * of vertices which fall in each bin.
	 */
	Map<Integer, List<Vertex>> verticesInBins = new HashMap<Integer, List<Vertex>>();

	/**
	 * Clears the content of
	 */
	public void clear() {
		verticesInBins.clear();
	}

	/**
	 * Adds the given vertex to the list of vertices for the given bin (creates
	 * the list if necessary).
	 */
	public void add(int binAddress, Vertex v) {
		List<Vertex> verticesInThisBin = verticesInBins.get(binAddress);
		if (verticesInThisBin == null)
			verticesInBins.put(binAddress,
					verticesInThisBin = new LinkedList<Vertex>());
		verticesInThisBin.add(v);
	}
}