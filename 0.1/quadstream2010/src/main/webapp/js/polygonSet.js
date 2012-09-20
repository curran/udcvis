dojo.declare("PolygonSet", null, {
	constructor : function() {
		this.rtree = new RTree();
		this.polygons = {};
		this.downloadedLocations = {};
	},
	initPolygon : function(x1, y1, x2, y2, polygonId) {
		var polygon = new Polygon(x1, y1, x2, y2, polygonId);
		this.rtree.insert(polygon);
		this.polygons[polygonId] = polygon;
	},
	
	parseAndAddBounds : function(text){
		var lines = text.split("\n");
		var line,polygonId,x1,x2,y1,y2;
		for ( var i = 0; i < lines.length; i++) {
			line = lines[i].split(",");
			polygonId = parseInt(line[0]);
			x1 = parseFloat(line[1]);
			y1 = parseFloat(line[2]);
			x2 = parseFloat(line[3]);
			y2 = parseFloat(line[4]);
			if (polygonId == -1)
				this.bounds = new Rectangle(x1, y1, x2, y2);
			else
				this.initPolygon(x1, y1, x2, y2,polygonId);
		}
	},
	parseAndAddVertices : function(text){
		var lines = text.split("\n");
		var line,x,y,level,polygonId,vertexId;
		for (var i = 0; i < lines.length; i++) {
			line = lines[i].split(",");
			x = parseFloat(line[0]);
			y = parseFloat(line[1]);
			level = parseFloat(line[2]);
			for(var j = 3;j<line.length;j+=2){
				polygonId = parseInt(line[j]);
				vertexId = parseInt(line[j+1]);
				this.polygons[polygonId].blgTree.insert(x, y, vertexId, level);
			}
		}
	},
	getVerticesForViewRect : function(r, callback) {
		if (r.w > 0 && r.h > 0) {
			var b = this.bounds;
			var addrs = [];
			var levels = [];
			var d = 1.0, l = 0, i, j, i0, i1, j0, j1;
			while (r.w <= b.w / d) {
				i0 = Math.floor(d * (r.x1 - b.x1) / b.w);
				j0 = Math.floor(d * (r.y1 - b.y1) / b.h);
				i1 = Math.ceil(d * (r.x2 - b.x1) / b.w);
				j1 = Math.ceil(d * (r.y2 - b.y1) / b.h);
				for (i = i0; i < i1; i++)
					for (j = j0; j < j1; j++) {
						var a = i + j * d;
						if(this.downloadedLocations[a+":"+l] == undefined){
							levels.push(l);
							addrs.push(a);
						}
					}
				d *= 2;
				l++;
			}
			var i = 0;
			var n = levels.length;
			var get = dojo.hitch(this,function() {
				if (i < n) {
					i++;
					this.getVertices(levels[i-1],addrs[i-1],get);
				} else
					callback();
			});
			get();
		}
	},
	initializeData : function(shapesURL,shapesetID,callback){
		this.shapesURL = shapesURL;
		this.shapesetID = shapesetID;
		
		$.get(shapesURL, {
			q : "bounds",
			d : this.shapesetID
		},dojo.hitch(this,function(text) {
			if (!err(text)) {
				this.parseAndAddBounds(text);
				this.getVertices(0,0,callback);
			}
		}));
	},
	getVertices:function(l,a,callback){
		$.get(this.shapesURL, {
			q : "shapes",
			d : this.shapesetID,
			l : l,
			a : a
		}, dojo.hitch(this,function(text) {
			if (!err(text)) {
				this.downloadedLocations[a+":"+l] = 1;
				this.parseAndAddVertices(text);
				callback();
			}
		}));
	}
});
dojo.declare("Polygon", Rectangle, {
	constructor : function(x1, y1, x2, y2, polygonID) {
		this.polygonID = polygonID;
		this.blgTree = new BLGTree();
	}
});
