package geometry;
import java.awt.geom.Rectangle2D;


@SuppressWarnings("serial")
public class Rectangle extends Rectangle2D.Double{

	public Rectangle(double x, double y, double width, double height) {
		super(x,y,width,height);
	}

	public Rectangle() {
	}

	public Rectangle copy() {
		return new Rectangle(x,y,width,height);
	}
}
