package org.curransoft.quadstream;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QuadGrid {
	List<Map<Integer, List<Vertex>>> vertices = new ArrayList<Map<Integer,List<Vertex>>>();

	public void clear() {
		vertices.clear();
	}

	public void add(VertexLocation spot, Vertex v) {
		Map<Integer, List<Vertex>> levelMap = null;
		if(spot.level >= vertices.size())
			vertices.add(spot.level, levelMap = new HashMap<Integer, List<Vertex>>());
		levelMap = vertices.get(spot.level);
		
		List<Vertex> vertices = levelMap.get(spot.address);
		if(vertices== null)
			levelMap.put(spot.address, vertices = new ArrayList<Vertex>());
		
		vertices.add(v);
	}
}