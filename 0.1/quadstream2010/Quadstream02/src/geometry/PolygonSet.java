package geometry;

import java.util.HashMap;
import java.util.Map;

import rtree.RTree;

public class PolygonSet {
	Map<Integer, MultiPolygon> polygons = new HashMap<Integer, MultiPolygon>();
	public RTree rtree = new RTree();
	public Rectangle bounds;

	public void add(int polygonId, MultiPolygon polygon) {
		polygons.put(polygonId, polygon);
		rtree.insert(polygon);
	}

	public void setBounds(Rectangle rect) {
		this.bounds = rect;
	}

	public MultiPolygon getPolygon(int polygonId) {
		return polygons.get(polygonId);
	}
}
