dojo.declare("Projection", null, {
	constructor : function(geoRect, screenRect) {
		this.geoRect = geoRect;
		this.screenRect = screenRect;
		this.aspectRatio = geoRect.w/geoRect.h;
	},
	xToLong : function(x) {
		return x / this.screenRect.w * this.geoRect.w + this.geoRect.x1;
	},
	yToLat : function(y) {
		return (this.screenRect.h - y) / this.screenRect.h * this.geoRect.h + this.geoRect.y1;
	},
	longToX : function(long) {
		return (long - this.geoRect.x1) / this.geoRect.w * this.screenRect.w;
	},
	latToY : function(lat) {
		return this.screenRect.h - (lat - this.geoRect.y1) / this.geoRect.h * this.screenRect.h;
	},
	/**
	 * Sets the given geoRect to be a geographic projection of the given
	 * screenRect.
	 */
	pixelToGeoRect : function(geoRect,screenRect){
		geoRect.x1 = this.xToLong(screenRect.x1);
		geoRect.y1 = this.yToLat(screenRect.y2);
		geoRect.x2 = this.xToLong(screenRect.x2);
		geoRect.y2 = this.yToLat(screenRect.y1);
		geoRect.w = geoRect.x2 - geoRect.x1;
		geoRect.h = geoRect.y2 - geoRect.y1;
	}
});