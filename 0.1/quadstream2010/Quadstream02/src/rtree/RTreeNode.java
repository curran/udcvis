package rtree;
import geometry.Rectangle;

import java.util.ArrayList;
import java.util.List;


@SuppressWarnings("serial")
public class RTreeNode extends Rectangle {
	public List<Rectangle> entries = null;
	public RTreeNode parent;
	public final boolean isLeaf;
	public boolean visited;

	public RTreeNode(boolean isLeaf) {
		super();
		this.isLeaf = isLeaf;
	}

	public void addEntry(Rectangle e) {
		if (entries == null) {
			entries = new ArrayList<Rectangle>();
			setRect(e);
		} else
			add(e);
		entries.add(e);
		if(e instanceof RTreeNode)
			((RTreeNode)e).parent = this;
	}

	public boolean isLeaf() {
		return isLeaf;
	}

	public void adjust() {
		boolean first = true;
		for (Rectangle n : entries)
			if (first) {
				setRect(n);
				first = false;
			} else
				add(n);
	}
}
