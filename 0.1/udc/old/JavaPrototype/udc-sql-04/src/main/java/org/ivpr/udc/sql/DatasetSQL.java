package org.ivpr.udc.sql;

import java.util.Collection;
import java.util.LinkedList;

import org.ivpr.udc.core.DataCube;
import org.ivpr.udc.core.Dataset;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.StmtIterator;
import com.hp.hpl.jena.vocabulary.RDF;

public class DatasetSQL extends DCResourceSQL implements Dataset {

	public DatasetSQL(Resource resource, UDCModelSQL model) {
		super(resource, model);
	}

	@Override
	public DataCube createDataCube(String uri) {
		Model m = model.jenaModel();
		Resource dataCube = m.createResource(uri);
		dataCube.addProperty(RDF.type, UDC.DataCube);
		
		Resource dataset = this.resource;
		dataset.addProperty(UDC.containsDataCube, dataCube);
		dataCube.addProperty(UDC.inDimesion, dataset);

		return new DataCubeSQL(dataCube, model);
	}

	@Override
	public Collection<DataCube> listDataCubes() {
		StmtIterator i = resource.listProperties(UDC.containsDataCube);
		Collection<DataCube> dataCubes = new LinkedList<DataCube>();
		for (; i.hasNext();) {
			String uri = i.nextStatement().getObject().asResource().getURI();
			dataCubes.add(model.getDataCube(uri));
		}
		i.close();
		return dataCubes;
	}
}
