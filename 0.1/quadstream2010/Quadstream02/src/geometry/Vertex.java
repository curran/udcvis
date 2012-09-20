package geometry;
import java.util.SortedSet;
import java.util.TreeSet;

public class Vertex implements Comparable<Vertex>{
	public final double x, y;
	public final int id;
	public final boolean isDummy;
	public SortedSet<Vertex> l,r;

	public Vertex(double x, double y, int id) {
		this.x = x;
		this.y = y;
		this.id = id;
		isDummy = false;
	}

	public Vertex(int id) {
		isDummy = true;
		this.x=this.y=0;
		this.id = id;
	}

	public int compareTo(Vertex o) {
		return id-o.id;
	}

	public SortedSet<Vertex> getL() {
		if(l == null){
			l = new TreeSet<Vertex>();
			//add a dummy to all trees
			l.add(new Vertex(id));
		}
		return l;
	}
	
	public SortedSet<Vertex> getR() {
		if(r == null){
			r = new TreeSet<Vertex>();
			//add a dummy to all trees
			r.add(new Vertex(id));
		}
		return r;
	}

}
