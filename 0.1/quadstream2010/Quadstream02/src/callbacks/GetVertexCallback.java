package callbacks;
public interface GetVertexCallback {
	public void getVertex(double x, double y, int polygonId, int vertexId,int level);
	public void finished();
}
