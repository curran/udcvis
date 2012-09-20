package org.curransoft.quadstream;

public class VertexLocation {
	public final int level;
	public final int address;

	public VertexLocation(int level, int address) {
		this.level = level;
		this.address = address;
	}

	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + (int) (address ^ (address >>> 32));
		result = prime * result + level;
		return result;
	}

	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (!(obj instanceof VertexLocation)) {
			return false;
		}
		VertexLocation other = (VertexLocation) obj;
		if (address != other.address) {
			return false;
		}
		if (level != other.level) {
			return false;
		}
		return true;
	}

}
