dojo.declare("RTree", null, {
	constructor : function() {
		this.maxEntries = 5;
		this.temp = new Rectangle(0, 0, 0, 0);
		this.xHigh = new Rectangle(-Number.MAX_VALUE, 0, 0, 0);
		this.xLow = new Rectangle(0, 0, Number.MAX_VALUE, 0);
		this.yHigh = new Rectangle(0, -Number.MAX_VALUE, 0, 0);
		this.yLow = new Rectangle(0, 0, 0, Number.MAX_VALUE);
	},
	insert : function(e) {
		if (this.root == undefined) {
			this.root = new RTreeNode(true);
			this.root.addEntry(e);
		} else {
			var l = this.chooseLeaf(e, this.root);
			l.addEntry(e);
			var ll;
			if (l.entries.length > this.maxEntries)
				ll = this.splitNode(l);
			var nn = this.adjustTree(l, ll);
			if (nn != null) {
				var n = this.root;
				this.root = new RTreeNode(false);
				this.root.addEntry(n);
				this.root.addEntry(nn);
			}
		}
	},
	search : function(result, r) {
		if (this.root != null)
			this.innerSearch(result, r, this.root);
	},
	innerSearch : function(result, r, n) {
		for (i in n.entries) {
			var c = n.entries[i];
			if (c.intersects(r))
				if (n.isLeaf)
					result.push(c);
				else
					this.innerSearch(result, r, c);
		}
	},
	forEachSearch : function(r,callback) {
		if (this.root != null)
			this.innerforEachSearch(r,callback, this.root);
	},
	innerforEachSearch : function(r,callback, n) {
		for (i in n.entries) {
			var c = n.entries[i];
			if (c.intersects(r))
				if (n.isLeaf)
					callback(c);
				else
					this.innerforEachSearch(r,callback, c);
		}
	},
	adjustTree : function(n, nn) {
		if (n == this.root)
			return nn;
		var p = n.parent;
		p.adjust();
		var pp;
		if (nn != undefined) {
			p.addEntry(nn);
			if (p.entries.length > this.maxEntries)
				pp = this.splitNode(p);
		}
		return this.adjustTree(p, pp);
	},
	splitNode : function(l) {
		var group = l.entries;
		var ll = new RTreeNode(l.isLeaf);
		l.entries = null;
		this.linearPickSeeds(l, ll, group);
		var nodes = [ l, ll ];
		for ( var i = 0; i < group.length; i++) {
			var e = group[i];
			if (e != undefined)
				this.smallestChanged(e, nodes).addEntry(e);
		}
		return ll;
	},
	linearPickSeeds : function(l, ll, group) {
		var xMin = Number.MAX_VALUE;
		var yMin = Number.MAX_VALUE;
		var xMax = -Number.MAX_VALUE;
		var yMax = -Number.MAX_VALUE;

		var xHigh = this.xHigh;
		var xLow = this.xLow;
		var yHigh = this.yHigh;
		var yLow = this.yLow;

		for ( var i = 0; i < group.length; i++) {
			var r = group[i];
			if (r.x1 > xHigh.x1)
				xHigh = r;
			if (r.x2 < xLow.x2)
				xLow = r;
			if (r.y1 > yHigh.y1)
				yHigh = r;
			if (r.y2 < yLow.y2)
				yLow = r;
			if (r.x2 > xMax)
				xMax = r.x2;
			if (r.x1 < xMin)
				xMin = r.x1;
			if (r.y2 > yMax)
				yMax = r.y2;
			if (r.y1 < yMin)
				yMin = r.y1;
		}
		var w = xMax - xMin;
		var h = yMax - yMin;
		var xGap = xHigh.x1 - xLow.x2;
		var yGap = yHigh.y1 - yLow.y2;
		if (xGap / w > yGap / h) {
			l.addEntry(xLow);
			ll.addEntry(xHigh);

			for ( var i = 0; i < group.length; i++)
				if (group[i] == xLow || group[i] == xHigh)
					group[i] = undefined;
		} else {
			l.addEntry(yLow);
			ll.addEntry(yHigh);
			for ( var i = 0; i < group.length; i++)
				if (group[i] == yLow || group[i] == yHigh)
					group[i] = undefined;
		}
	},
	chooseLeaf : function(e, n) {
		return n.isLeaf ? n : this.chooseLeaf(e, this.smallestChanged(e,
				n.entries));
	},
	smallestChanged : function(e, entries) {
		var smallestChange = Number.MAX_VALUE;
		var f;
		for ( var i = 0; i < entries.length; i++) {
			o = entries[i];
			this.temp.set(o);
			this.temp.add(e);
			var change = this.temp.area() - o.area();
			if (change < smallestChange) {
				f = o;
				smallestChange = change;
			}
		}
		return f;
	}
});
dojo.declare("RTreeNode", Rectangle, {
	constructor : function(isLeaf) {
		this.isLeaf = isLeaf;
		this.isRTreeNode = true;
	},
	addEntry : function(e) {
		if (this.entries == undefined) {
			this.entries = [];
			this.set(e);
		} else
			this.add(e);
		this.entries.push(e);
		if (e.isRTreeNode)
			e.parent = this;
	},
	adjust : function() {
		var first = true;
		for ( var i = 0; i < this.entries.length; i++) {
			var n = this.entries[i];
			if (first) {
				this.set(n);
				first = false;
			} else
				this.add(n);
		}
	}
});
