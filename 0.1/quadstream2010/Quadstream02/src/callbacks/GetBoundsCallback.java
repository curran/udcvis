package callbacks;
public interface GetBoundsCallback {
	public void getBounds(int polygonId, double x, double y, double width,
			double height);

	public void finished();
}
