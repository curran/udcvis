package geometry;

import java.util.SortedSet;
import java.util.TreeSet;

import callbacks.VertexForEachCallback;

@SuppressWarnings("serial")
public class MultiPolygon extends Rectangle {
	SortedSet<Vertex> vertices = new TreeSet<Vertex>();

	public MultiPolygon(double x, double y, double width, double height) {
		super(x, y, width, height);
	}

	public void addVertex(Vertex v, int level) {
		vertices.add(v);
//		SortedSet<Vertex> curr = vertices;
//		int currLevel = 0;
//		while (true) {
//			if (level == currLevel) {
//				curr.add(v);
//				break;
//			} else {
//				Vertex nearest = getNearest(curr,v);
//				if (nearest != null) {
//					if (v.id < nearest.id)
//						curr = nearest.getL();
//					else
//						curr = nearest.getR();
//					currLevel++;
//					continue;
//				} else {
//					System.err.println("error - no nearest!");
//					break;
//				}
//			}
//		}
	}

	private Vertex getNearest(SortedSet<Vertex> curr,Vertex v) {
		Vertex nearest = null;
		for (Vertex vertex : curr) {
			nearest = vertex;
			if (v.id < vertex.id)
				break;
		}
		return nearest;
	}

	public void forEach(VertexForEachCallback callback, int maxLevel) {
		traverse(vertices, 0, maxLevel, callback);
	}

	private void traverse(SortedSet<Vertex> vertices, int level, int maxLevel,
			VertexForEachCallback callback) {
		for (Vertex v : vertices) {
			if (level < maxLevel && v.l != null)
				traverse(v.l, level + 1, maxLevel, callback);
			if (!v.isDummy)
				callback.call(v);
			if (level < maxLevel && v.r != null)
				traverse(v.r, level + 1, maxLevel, callback);
		}
	}
}
