package org.curransoft.quadstream;

/**
 * The serializable class representing shape configuration files.
 * 
 * @author curran
 * 
 */
public class ShapesConfig {
	String id;
	String name;
	String description;
	String source;
	String sqlHost;
	String sqlUser;
	String sqlPassword;
	String sqlDatabase;
	String sqlTablePrefix;

	public ShapesConfig() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getSqlUser() {
		return sqlUser;
	}

	public void setSqlUser(String sqlUser) {
		this.sqlUser = sqlUser;
	}

	public String getSqlPassword() {
		return sqlPassword;
	}

	public void setSqlPassword(String sqlPassword) {
		this.sqlPassword = sqlPassword;
	}

	public String getSqlDatabase() {
		return sqlDatabase;
	}

	public void setSqlDatabase(String sqlDatabase) {
		this.sqlDatabase = sqlDatabase;
	}

	public String getSqlTablePrefix() {
		return sqlTablePrefix;
	}

	public void setSqlTablePrefix(String sqlTablePrefix) {
		this.sqlTablePrefix = sqlTablePrefix;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getSqlHost() {
		return sqlHost;
	}

	public void setSqlHost(String sqlHost) {
		this.sqlHost = sqlHost;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((source == null) ? 0 : source.hashCode());
		result = prime * result
				+ ((sqlDatabase == null) ? 0 : sqlDatabase.hashCode());
		result = prime * result
				+ ((sqlPassword == null) ? 0 : sqlPassword.hashCode());
		result = prime * result
				+ ((sqlTablePrefix == null) ? 0 : sqlTablePrefix.hashCode());
		result = prime * result + ((sqlUser == null) ? 0 : sqlUser.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ShapesConfig other = (ShapesConfig) obj;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (source == null) {
			if (other.source != null)
				return false;
		} else if (!source.equals(other.source))
			return false;
		if (sqlDatabase == null) {
			if (other.sqlDatabase != null)
				return false;
		} else if (!sqlDatabase.equals(other.sqlDatabase))
			return false;
		if (sqlPassword == null) {
			if (other.sqlPassword != null)
				return false;
		} else if (!sqlPassword.equals(other.sqlPassword))
			return false;
		if (sqlTablePrefix == null) {
			if (other.sqlTablePrefix != null)
				return false;
		} else if (!sqlTablePrefix.equals(other.sqlTablePrefix))
			return false;
		if (sqlUser == null) {
			if (other.sqlUser != null)
				return false;
		} else if (!sqlUser.equals(other.sqlUser))
			return false;
		return true;
	}
}
