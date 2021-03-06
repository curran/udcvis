/* CVS $Id: $ */
package org.ivpr.udc.sql; 
import com.hp.hpl.jena.rdf.model.*;
import com.hp.hpl.jena.ontology.*;
 
/**
 * Vocabulary definitions from udc.owl 
 * @author Auto-generated by schemagen on 02 Aug 2010 15:23 
 */
public class UDC {
    /** <p>The ontology model that holds the vocabulary terms</p> */
    private static OntModel m_model = ModelFactory.createOntologyModel( OntModelSpec.OWL_MEM, null );
    
    /** <p>The namespace of the vocabulary as a string</p> */
    public static final String NS = "http://datacubes.info/ontologies/2010/6/udc.owl#";
    
    /** <p>The namespace of the vocabulary as a string</p>
     *  @see #NS */
    public static String getURI() {return NS;}
    
    /** <p>The namespace of the vocabulary as a resource</p> */
    public static final Resource NAMESPACE = m_model.createResource( NS );
    
    public static final ObjectProperty containsDataCube = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#containsDataCube" );
    
    public static final ObjectProperty containsDimensionInstance = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#containsDimensionInstance" );
    
    public static final ObjectProperty containsLevel = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#containsLevel" );
    
    public static final ObjectProperty containsMeasureInstance = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#containsMeasureInstance" );
    
    public static final ObjectProperty containsRecord = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#containsRecord" );
    
    public static final ObjectProperty containsUnit = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#containsUnit" );
    
    public static final ObjectProperty hasAggregationOperator = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#hasAggregationOperator" );
    
    public static final ObjectProperty hasChildLevel = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#hasChildLevel" );
    
    public static final ObjectProperty hasChildRecord = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#hasChildRecord" );
    
    public static final ObjectProperty hasLevel = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#hasLevel" );
    
    public static final ObjectProperty hasMeasure = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#hasMeasure" );
    
    public static final ObjectProperty hasNextRecord = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#hasNextRecord" );
    
    public static final ObjectProperty hasParentLevel = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#hasParentLevel" );
    
    public static final ObjectProperty hasParentRecord = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#hasParentRecord" );
    
    public static final ObjectProperty hasQuantity = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#hasQuantity" );
    
    public static final ObjectProperty hasUnit = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#hasUnit" );
    
    public static final ObjectProperty inDataset = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#inDataset" );
    
    public static final ObjectProperty inDimenionInstance = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#inDimenionInstance" );
    
    public static final ObjectProperty inDimesion = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#inDimesion" );
    
    public static final ObjectProperty inLevel = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#inLevel" );
    
    public static final ObjectProperty inQuantity = m_model.createObjectProperty( "http://datacubes.info/ontologies/2010/6/udc.owl#inQuantity" );
    
    public static final OntClass AggregationOperator = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#AggregationOperator" );
    
    public static final OntClass DataCube = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#DataCube" );
    
    public static final OntClass Dataset = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#Dataset" );
    
    public static final OntClass Dimension = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#Dimension" );
    
    public static final OntClass DimensionInstance = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#DimensionInstance" );
    
    public static final OntClass Level = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#Level" );
    
    public static final OntClass Measure = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#Measure" );
    
    public static final OntClass MeasureInstance = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#MeasureInstance" );
    
    public static final OntClass Quantity = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#Quantity" );
    
    public static final OntClass Record = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#Record" );
    
    public static final OntClass Unit = m_model.createClass( "http://datacubes.info/ontologies/2010/6/udc.owl#Unit" );
    
}
