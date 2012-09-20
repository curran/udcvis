package rtree;

import geometry.Rectangle;

import java.util.ArrayList;
import java.util.List;

public class RTree {
	RTreeNode root;
	Rectangle temp = new Rectangle();
	public static int maxEntries = 2;

	public void insert(Rectangle e) {
		if (root == null) {
			root = new RTreeNode(true);
			root.addEntry(e);
		} else {
			RTreeNode l = chooseLeaf(e, root);
			l.addEntry(e);
			RTreeNode ll = null;
			if (l.entries.size() > maxEntries)
				ll = splitNode(l);
			RTreeNode nn = adjustTree(l, ll);
			if (nn != null) {
				RTreeNode n = root;
				root = new RTreeNode(false);
				root.addEntry(n);
				root.addEntry(nn);
			}
		}
	}

	private RTreeNode adjustTree(RTreeNode n, RTreeNode nn) {
		if (n == root)
			return nn;
		RTreeNode p = n.parent;
		p.adjust();
		RTreeNode pp = null;
		if (nn != null) {
			p.addEntry(nn);
			if (p.entries.size() > maxEntries)
				pp = splitNode(p);
		}
		return adjustTree(p, pp);
	}

	/**
	 * L should be an overfull leaf node. This function partitions the entries
	 * of l between l and the returned node.
	 */
	private RTreeNode splitNode(RTreeNode l) {
		List<Rectangle> group = l.entries;
		RTreeNode ll = new RTreeNode(l.isLeaf);
		l.entries = null;

		linearPickSeeds(l, ll, group);
		List<Rectangle> nodes = new ArrayList<Rectangle>(2);
		nodes.add(l);
		nodes.add(ll);
		for (Rectangle e : group)
			((RTreeNode) smallestChanged(e, nodes)).addEntry(e);
		return ll;
	}

	private void linearPickSeeds(RTreeNode l, RTreeNode ll, List<Rectangle> group) {
		double xMin = Double.MAX_VALUE;
		double yMin = Double.MAX_VALUE;
		double xMax = -Double.MAX_VALUE;
		double yMax = -Double.MAX_VALUE;

		Rectangle xHigh = new Rectangle(-Double.MAX_VALUE, 0, 0, 0);
		Rectangle xLow = new Rectangle(Double.MAX_VALUE, 0, 0, 0);
		Rectangle yHigh = new Rectangle(0, -Double.MAX_VALUE, 0, 0);
		Rectangle yLow = new Rectangle(0, Double.MAX_VALUE, 0, 0);

		for (Rectangle r : group) {
			if (r.x > xHigh.x)
				xHigh = r;
			if (r.x + r.width < xLow.x + xLow.width)
				xLow = r;
			if (r.y > yHigh.y)
				yHigh = r;
			if (r.y + r.height < yLow.y + xLow.height)
				yLow = r;
			if (r.x + r.width > xMax)
				xMax = r.x + r.width;
			if (r.x < xMin)
				xMin = r.x;
			if (r.y + r.height > yMax)
				yMax = r.y + r.height;
			if (r.y < yMin)
				yMin = r.y;
		}
		double w = xMax - xMin;
		double h = yMax - yMin;
		double xGap = xHigh.x - (xLow.x + xLow.width);
		double yGap = yHigh.y - (yLow.y + yLow.height);
		if (xGap / w > yGap / h) {
			group.remove(xLow);
			l.addEntry(xLow);
			group.remove(xHigh);
			ll.addEntry(xHigh);
		} else {
			group.remove(yLow);
			l.addEntry(yLow);
			group.remove(yHigh);
			ll.addEntry(yHigh);
		}
	}

	private RTreeNode chooseLeaf(Rectangle e, RTreeNode n) {
		if (n.isLeaf())
			return n;
		else {
			Rectangle f = smallestChanged(e, n.entries);
			return chooseLeaf(e, (RTreeNode) f);
		}
	}

	/**
	 * Returns the node from nodes whose area would change the least if e were
	 * added to it.
	 */
	private Rectangle smallestChanged(Rectangle e, List<Rectangle> entries) {
		double smallestChange = Double.MAX_VALUE;
		Rectangle f = null;
		for (Rectangle i : entries) {
			double originalArea = i.width * i.height;
			temp.setRect(i);
			temp.add(e);
			double updatedArea = temp.width * temp.height;
			double change = updatedArea - originalArea;
			if (change < smallestChange) {
				f = i;
				smallestChange = change;
			}
		}
		return f;
	}

	public void unmarkAll() {
		unmarkAll(root);
	}

	private void unmarkAll(RTreeNode n) {
		if (n.entries != null)
			for (Rectangle e : n.entries)
				if (e instanceof RTreeNode) {
					RTreeNode r = (RTreeNode) e;
					r.visited = false;
					unmarkAll(r);
				}
	}

	public void search(List<Rectangle> result, Rectangle r) {
		if (root != null)
			innerSearch(result, r, root);
	}

	private void innerSearch(List<Rectangle> result, Rectangle r, RTreeNode n) {
		n.visited = true;
		for (Rectangle c : n.entries)
			if (c.intersects(r))
				if (n.isLeaf)
					result.add(c);
				else
					innerSearch(result, r, (RTreeNode) c);
	}

}
