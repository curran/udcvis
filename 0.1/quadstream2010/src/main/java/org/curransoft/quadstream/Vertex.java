package org.curransoft.quadstream;
import java.util.ArrayList;
import java.util.List;
public class Vertex {
	public double x;
	public double y;
	
	int numMemberships = 0;
	public int[] membershipPolygonIDs = new int[2];
	public int[] membershipVertexIDs = new int[2];

	private List<Vertex> adjacentVertices = new ArrayList<Vertex>();
	public double level;

	public Vertex(double x, double y) {
		this.x = x;
		this.y = y;
	}

	public void addAdjacentVertex(Vertex v) {
		if (!adjacentVertices.contains(v))
			adjacentVertices.add(v);
	}

	public int degree() {
		return adjacentVertices.size();
	}

	public int getNumMemberships() {
		return numMemberships;
	}

	public void addMembership(int polygonId, int vertexId) {
		int n = membershipPolygonIDs.length;
		if (numMemberships > n - 1) {
			int[] oldMembershipPolygonIDs = membershipPolygonIDs;
			int[] oldMembershipVertexIDs = membershipVertexIDs;
			membershipPolygonIDs = new int[n * 2];
			membershipVertexIDs = new int[n * 2];
			for (int i = 0; i < n; i++) {
				membershipPolygonIDs[i] = oldMembershipPolygonIDs[i];
				membershipVertexIDs[i] = oldMembershipVertexIDs[i];
			}
		}
		membershipPolygonIDs[numMemberships] = polygonId;
		membershipVertexIDs[numMemberships] = vertexId;
		numMemberships++;
	}

	public int hashCode() {
		final int prime = 31;
		int result = 1;
		long temp;
		temp = Double.doubleToLongBits(x);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		temp = Double.doubleToLongBits(y);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		return result;
	}

	public boolean equals(Object obj) {
		if (obj instanceof Vertex) {
			Vertex v = (Vertex) obj;
			return v.x == x && v.y == y;
		} else
			return false;
	}
}
