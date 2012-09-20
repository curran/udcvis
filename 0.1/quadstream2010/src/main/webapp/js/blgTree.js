dojo.declare("BLGTree", null, {
	constructor : function() {
		this.root = new BLGTreeNode(0,0,-1,-Number.MAX_VALUE);
	},
	insert : function(x, y, vertexId, level) {
		var v = new BLGTreeNode(x, y, vertexId, level);
		this.ins(this.root, v);
	},
	insertNode : function(node) {
		this.ins(this.root, node);
	},
	ins : function(c, v) {
		if(v.level >= c.level)
			if(v.id > c.id)
				if(c.r == undefined){
					c.r = v;
					v.p = c;
				}
				else
					this.ins(c.r,v);
			else if(v.id < c.id)
				if(c.l == undefined){
					c.l = v;
					v.p = c;
				}
				else
					this.ins(c.l,v);
			else
				console.log("warning: Attempted to insert a duplicate vertex: id = "+v.id);
		else{
			var p = c.p;
			if(p.r != undefined && p.r == c)
				p.r = undefined;
			else if(p.l != undefined && p.l == c)
				p.l = undefined;
			else
				console.log("warning: invalid BLG tree state: parent node did not contain a child that it should have.");
			this.ins(p,v);
			this.insAll(p,c);
		}
	},
	insAll:function(p,c){
		if (c != undefined) {
			this.insAll(p,c.l);
			this.insAll(p,c.r);
			c.l = undefined;
			c.r = undefined;
			this.ins(p,c);
		}
	},
	forEach : function(callback,maxLevel) {
		this.innerForEach(this.root, callback,maxLevel);
	},
	innerForEach : function(curr, callback,maxLevel) {
		if (curr != undefined && curr.level <= maxLevel) {
			this.innerForEach(curr.l, callback,maxLevel);
			if (curr.id != -1)
				callback(curr.x, curr.y);
			this.innerForEach(curr.r, callback,maxLevel);
		}
	},
	forFirst : function(callback,maxLevel) {
		var curr = this.root.r;
		if(curr != undefined){
			while(curr.l != undefined)
				curr = curr.l;
			callback(curr.x, curr.y);
		}
	},
	toString : function(maxLevel){
		return this.innerToString(this.root,"", maxLevel);
	},
	innerToString:function(curr,str,maxLevel){
		if (curr != undefined && curr.level <= maxLevel) {
			if (curr.id != -1)
				str = str+"( ";
			str = this.innerToString(curr.l, str,maxLevel);
			if (curr.id != -1)
				str = str + " "+curr.id+" ";
			str = this.innerToString(curr.r, str,maxLevel);
			if (curr.id != -1)
				str = str+" )";
		}
		return str;
	}
});
function BLGTreeNode(x, y, id, level) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.level = level;
};
