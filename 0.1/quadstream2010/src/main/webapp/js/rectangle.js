/**
 * This class represents a rectangle, having the attributes x1,x2,y1,y2,w,and h.
 * w (width) and h (height) are derived from x1,x2 and y1,y2, so do not set
 * these directly. Use the methods setX1, setY1, setX2, setY2 instead.
 */
dojo.declare("Rectangle", null,
		{
			constructor : function(x1, y1, x2, y2) {
				this.x1 = x1;
				this.y1 = y1;
				this.x2 = x2;
				this.y2 = y2;
				this.w = x2 - x1;
				this.h = y2 - y1;
			},
			set : function(r) {
				this.x1 = r.x1;
				this.y1 = r.y1;
				this.x2 = r.x2;
				this.y2 = r.y2;
				this.w = r.x2 - r.x1;
				this.h = r.y2 - r.y1;
			},
			setX1 : function(x1) {
				this.x1 = x1;
				this.w = this.x2 - this.x1;
			},
			setY1 : function(y1) {
				this.y1 = y1;
				this.h = this.y2 - this.y1;
			},
			setX2 : function(x2) {
				this.x2 = x2;
				this.w = this.x2 - this.x2;
			},
			setY2 : function(y2) {
				this.y2 = y2;
				this.h = this.y2 - this.y2;
			},
			setW : function(w) {
				this.w = w;
				this.x2 = this.x1 + w;
			},
			setH : function(h) {
				this.h = h;
				this.y2 = this.y1 + h;
			},
			intersects : function(other) {
				return !(this.x1 > other.x2 || this.x2 < other.x1
						|| this.y1 > other.y2 || this.y2 < other.y1);
			},
			add : function(r) {
				this.x1 = this.x1 < r.x1 ? this.x1 : r.x1;
				this.y1 = this.y1 < r.y1 ? this.y1 : r.y1;
				this.x2 = this.x2 > r.x2 ? this.x2 : r.x2;
				this.y2 = this.y2 > r.y2 ? this.y2 : r.y2;
			},
			area : function() {
				return (this.x2 - this.x1) * (this.y2 - this.y1);
			},
			toString : function() {
				return "Rectangle: x1 = " + this.x1 + ", y1 = " + this.y1
						+ ", x2 = " + this.x2 + ", y2 = " + this.y2 + ", w = "
						+ this.w + ", h = " + this.h;
			},
			ensurePositiveArea : function() {
				var temp;
				if (this.x1 > this.x2) {
					temp = this.x1;
					this.x1 = this.x2;
					this.x2 = temp;
					this.w = this.x2 - this.x1;
				}
				if (this.y1 > this.y2) {
					temp = this.y1;
					this.y1 = this.y2;
					this.y2 = temp;
					this.h = this.y2 - this.y1;
				}
			},
			ensureAspectRatio : function(aspectRatio) {
				this.setW(this.h * aspectRatio);
			},
			move : function(xOffset, yOffset) {
				this.x1 += xOffset;
				this.y1 += yOffset;
				this.x2 += xOffset;
				this.y2 += yOffset;
			},
			/**
			 * Sets this rect to be a linear interpolation between the given
			 * rectangles a and b. p is a number between 0 and 1 which specifies
			 * where the interpolation should be evaluated.
			 */
			interpolate : function(a, b, p) {
				var ip = 1.0 - p;
				this.x1 = a.x1 * ip + b.x1 * p;
				this.y1 = a.y1 * ip + b.y1 * p;
				this.x2 = a.x2 * ip + b.x2 * p;
				this.y2 = a.y2 * ip + b.y2 * p;
				this.w = this.x2 - this.x1;
				this.h = this.y2 - this.y1;
			}
		});
