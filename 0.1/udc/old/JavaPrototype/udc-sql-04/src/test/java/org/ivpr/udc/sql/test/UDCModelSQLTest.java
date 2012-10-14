package org.ivpr.udc.sql.test;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

import org.hsqldb.jdbc.jdbcDataSource;
import org.ivpr.udc.core.AggregationOperator;
import org.ivpr.udc.core.DataCube;
import org.ivpr.udc.core.Dataset;
import org.ivpr.udc.core.Dimension;
import org.ivpr.udc.core.DimensionInstance;
import org.ivpr.udc.core.InternationalString;
import org.ivpr.udc.core.Level;
import org.ivpr.udc.core.LocalizedString;
import org.ivpr.udc.core.Measure;
import org.ivpr.udc.core.MeasureInstance;
import org.ivpr.udc.core.Quantity;
import org.ivpr.udc.core.Record;
import org.ivpr.udc.core.UDCException;
import org.ivpr.udc.core.UDCModel;
import org.ivpr.udc.core.Unit;
import org.ivpr.udc.sql.UDCModelSQL;

/**
 * Unit test for simple App.
 */
public class UDCModelSQLTest extends TestCase {
	String domain = "http://datacubes.org";
	String dimensionsURI = domain + "/dimensions";
	String quantitiesURI = domain + "/quantities";
	String unitsURI = domain + "/units";
	String measuresURI = domain + "/measures";
	String aggregationOperatorsURI = domain + "/aggregationOperators";
	String datasetsURI = domain + "/datasets";
	String dataCubesURI = domain + "/dataCubes";

	public static void main(String[] args) {
		// new UDCModelSQLTest("foo").testModel();
		new UDCModelSQLTest("foo").testModel();

	}

	private void testModel() {
		UDCModel model = createUDCModel();

		String timeURI = dimensionsURI + "/time";
		InternationalString timeName = intlName("Time", "en", "Zeit", "de");
		Dimension time = model.createDimension(timeURI, timeName);
		assertEquals(timeURI, time.uri());
		assertEquals(timeName, time.name());

		String yearsURI = timeURI + "/years";
		InternationalString yearsName = intlName("Year", "en", "Jahr", "de");
		InternationalString yearsNamePl = intlName("Years", "en", "Jahre", "de");
		Level years = time.createLevel(yearsURI, yearsName, yearsNamePl);
		assertEquals(yearsURI, years.uri());
		assertEquals(yearsName, years.name());
		assertEquals(yearsNamePl, years.namePlural());

		InternationalString yearsName1 = intlName("Year1", "en", "Jahr1", "de");
		years.setName(yearsName1);
		assertEquals(yearsName1, years.name());
		InternationalString yearsNamePl1 = intlName("Years1", "en", "Jahre1",
				"de");
		years.setNamePlural(yearsNamePl1);
		assertEquals(yearsNamePl1, years.namePlural());

		String monthsURI = timeURI + "/months";
		InternationalString monthsName = intlName("Year", "en", "Monat", "de");
		InternationalString monthsNamePl = intlName("Months", "en", "Monate",
				"de");
		Level months = time.createLevel(monthsURI, monthsName, monthsNamePl);
		assertEquals(monthsURI, months.uri());
		assertEquals(monthsName, months.name());
		assertEquals(monthsNamePl, months.namePlural());

		months.addParent(years);
		assertTrue(months.parents().contains(years));

		InternationalString monthsName1 = intlName("Year1", "en", "Monat1",
				"de");
		months.setName(monthsName1);
		assertEquals(monthsName1, months.name());

		InternationalString monthsNamePl1 = intlName("Months1", "en",
				"Monate1", "de");
		months.setNamePlural(monthsNamePl1);
		assertEquals(monthsNamePl1, months.namePlural());

		String spaceURI = dimensionsURI + "/space";
		InternationalString spaceName = intlName("Space", "en", "Raum", "de");
		Dimension space = model.createDimension(spaceURI, spaceName);
		assertEquals(spaceURI, space.uri());
		assertEquals(spaceName, space.name());

		String countriesURI = spaceURI + "/countries";
		InternationalString countriesName = intlName("Country", "en", "Land",
				"de");
		InternationalString countriesNamePl = intlName("Countries", "en",
				"Lände", "de");
		Level countries = space.createLevel(countriesURI, countriesName,
				countriesNamePl);
		assertEquals(countriesURI, countries.uri());
		assertEquals(countriesName, countries.name());
		assertEquals(countriesNamePl, countries.namePlural());

		String usStatesURI = spaceURI + "/usStates";
		InternationalString usStatesName = intlName("State", "en", "Staat",
				"de");
		InternationalString usStatesNamePl = intlName("States", "en",
				"Staaten", "de");
		Level usStates = space.createLevel(usStatesURI, usStatesName,
				usStatesNamePl);
		usStates.addParent(countries);
		assertEquals(usStatesURI, usStates.uri());
		assertEquals(usStatesName, usStates.name());
		assertEquals(usStatesNamePl, usStates.namePlural());
		assertEquals(countries, usStates.parents().iterator().next());

		String usCountiesURI = spaceURI + "/usCounties";
		InternationalString usCountiesName = intlName("County", "en");
		InternationalString usCountiesNamePl = intlName("Counties", "en");
		Level usCounties = space.createLevel(usCountiesURI, usCountiesName,
				usCountiesNamePl);
		usCounties.addParent(usStates);
		assertEquals(usCountiesURI, usCounties.uri());
		assertEquals(usCountiesNamePl, usCounties.namePlural());
		assertEquals(usCountiesName, usCounties.name());
		assertEquals(usStates, usCounties.parents().iterator().next());

		String bundesländeURI = spaceURI + "/bundeslände";
		InternationalString bundesländeName = intlName("Bundesland", "de",
				"State", "en");
		InternationalString bundesländeNamePl = intlName("Bundeslände", "de",
				"States", "en");
		Level bundeslände = space.createLevel(bundesländeURI, bundesländeName,
				bundesländeNamePl);
		bundeslände.addParent(countries);
		assertEquals(bundesländeURI, bundeslände.uri());
		assertEquals(bundesländeName, bundeslände.name());
		assertEquals(bundesländeNamePl, bundeslände.namePlural());
		assertEquals(countries, bundeslände.parents().iterator().next());

		String regierungsbezirkeURI = spaceURI + "/regierungsbezirke";
		InternationalString regierungsbezirkeName = intlName(
				"Regierungsbezirk", "de", "Administrative Region", "en");
		InternationalString regierungsbezirkeNamePl = intlName(
				"Regierungsbezirke", "de", "Administrative Regions", "en");
		Level regierungsbezirke = space.createLevel(regierungsbezirkeURI,
				regierungsbezirkeName, regierungsbezirkeNamePl);
		regierungsbezirke.addParent(bundeslände);
		assertEquals(regierungsbezirkeURI, regierungsbezirke.uri());
		assertEquals(regierungsbezirkeNamePl, regierungsbezirke.namePlural());
		assertEquals(regierungsbezirkeName, regierungsbezirke.name());
		assertEquals(bundeslände, regierungsbezirke.parents().iterator().next());

		String landkreiseURI = spaceURI + "/landkreise";
		InternationalString landkreiseName = intlName("Landkreis", "de",
				"District", "en");
		InternationalString landkreiseNamePl = intlName("Landkreiss", "de",
				"Districts", "en");
		Level landkreise = space.createLevel(landkreiseURI, landkreiseName,
				landkreiseNamePl);
		landkreise.addParent(regierungsbezirke);
		assertEquals(landkreiseURI, landkreise.uri());
		assertEquals(landkreiseNamePl, landkreise.namePlural());
		assertEquals(landkreiseName, landkreise.name());
		assertEquals(regierungsbezirke, landkreise.parents().iterator().next());

		String year1991URI = yearsURI + "/1991";
		Record year1991 = years.createRecord(year1991URI);
		InternationalString year1991Name = intlName("1991", "en");
		year1991.setName(year1991Name);
		assertEquals(year1991URI, year1991.uri());
		assertEquals(year1991Name, year1991.name());
		assertEquals(years, year1991.level());

		String year1990URI = yearsURI + "/1990";
		Record year1990 = years.createRecord(year1990URI);
		InternationalString year1990Name = intlName("1990", "en");
		year1990.setName(year1990Name);
		year1990.setNext(year1991);
		assertEquals(year1990URI, year1990.uri());
		assertEquals(year1990Name, year1990.name());
		assertEquals(year1991, year1990.next());
		assertEquals(years, year1990.level());

		String usaURI = countriesURI + "/USA";
		Record usa = countries.createRecord(usaURI);
		InternationalString usaName = intlName("United States of America",
				"en", "Vereinigte Staaten von Amerika", "de");
		usa.setName(usaName);
		usa.addAlternateName(locName("USA", "en"));
		usa.addAlternateName(locName("United States", "en"));
		usa.addAlternateName(locName("The States", "en"));
		usa.addAlternateName(locName("The U. S.", "en"));
		usa.addAlternateName(locName("Amerika", "de"));
		usa.addAlternateName(locName("Die Vereinigten Staaten", "de"));
		assertEquals(usaURI, usa.uri());
		assertEquals(usaName, usa.name());
		assertEquals(countries, usa.level());

		String newYorkURI = usStatesURI + "/NewYork";
		Record newYork = usStates.createRecord(newYorkURI);
		InternationalString newYorkName = intlName("New York", "en");
		newYork.setName(newYorkName);
		newYork.addParent(usa);
		assertEquals(newYorkURI, newYork.uri());
		assertEquals(newYorkName, newYork.name());
		assertEquals(usa, newYork.parents().iterator().next());
		assertEquals(usStates, newYork.level());

		String massachusettsURI = usStatesURI + "/Massachusetts";
		Record massachusetts = usStates.createRecord(massachusettsURI);
		InternationalString massachusettsName = intlName("Massachusetts", "en");
		massachusetts.setName(massachusettsName);
		massachusetts.addParent(usa);
		assertEquals(massachusettsURI, massachusetts.uri());
		assertEquals(massachusettsName, massachusetts.name());
		assertEquals(usa, massachusetts.parents().iterator().next());
		assertEquals(usStates, massachusetts.level());

		String middlesexURI = usCountiesURI + "/Middlesex";
		Record middlesex = usCounties.createRecord(middlesexURI);
		InternationalString middlesexName = intlName("Middlesex", "en");
		middlesex.setName(middlesexName);
		middlesex.addParent(massachusetts);
		assertEquals(middlesexURI, middlesex.uri());
		assertEquals(middlesexName, middlesex.name());
		assertEquals(massachusetts, middlesex.parents().iterator().next());
		assertEquals(usCounties, middlesex.level());

		String deutschlandURI = countriesURI + "/Deutschland";
		Record deutschland = countries.createRecord(deutschlandURI);
		InternationalString deutschlandName = intlName("Deutschland", "de",
				"Germany", "en");
		deutschland.setName(deutschlandName);
		LocalizedString deutschlandName1 = locName(
				"Federal Republic of Germany", "en");
		deutschland.addAlternateName(deutschlandName1);
		LocalizedString deutschlandName2 = locName(
				"Bundesrepublik Deutschland", "de");
		deutschland.addAlternateName(deutschlandName2);
		assertEquals(deutschlandURI, deutschland.uri());
		assertEquals(deutschlandName, deutschland.name());
		assertEquals(countries, deutschland.level());
		assertTrue(deutschland.alternateNames().contains(deutschlandName1));
		assertTrue(deutschland.alternateNames().contains(deutschlandName2));

		String badenWürttembergURI = bundesländeURI + "/Baden-Württemberg";
		Record badenWürttemberg = bundeslände.createRecord(badenWürttembergURI);
		InternationalString badenWürttembergName = intlName(
				"Baden-Württemberg", "de");
		badenWürttemberg.setName(badenWürttembergName);
		badenWürttemberg.addParent(deutschland);
		assertEquals(badenWürttembergURI, badenWürttemberg.uri());
		assertEquals(badenWürttembergName, badenWürttemberg.name());
		assertEquals(deutschland, badenWürttemberg.parents().iterator().next());
		assertEquals(bundeslände, badenWürttemberg.level());

		String freiburgURI = regierungsbezirkeURI + "/Freiburg";
		Record freiburg = regierungsbezirke.createRecord(freiburgURI);
		InternationalString freiburgName = intlName("Freiburg", "de");
		freiburg.setName(freiburgName);
		freiburg.addParent(badenWürttemberg);
		assertEquals(freiburgURI, freiburg.uri());
		assertEquals(freiburgName, freiburg.name());
		assertEquals(badenWürttemberg, freiburg.parents().iterator().next());
		assertEquals(regierungsbezirke, freiburg.level());

		String konstanzURI = landkreiseURI + "/Konstanz";
		Record konstanz = landkreise.createRecord(konstanzURI);
		InternationalString konstanzName = intlName("Konstanz", "de",
				"Constance", "en");
		konstanz.setName(konstanzName);
		konstanz.addParent(freiburg);
		assertEquals(konstanzURI, konstanz.uri());
		assertEquals(konstanzName, konstanz.name());
		assertEquals(freiburg, konstanz.parents().iterator().next());
		assertEquals(landkreise, konstanz.level());

		String currencyURI = quantitiesURI + "/Currency";
		InternationalString currencyName = intlName("Currency", "en");
		Quantity currency = model.createQuantity(currencyURI, currencyName);
		assertEquals(currencyURI, currency.uri());
		assertEquals(currencyName, currency.name());

		String numberOfPeopleURI = quantitiesURI + "/NumberOfPeople";
		InternationalString numberOfPeopleName = intlName("Number of People",
				"en");
		Quantity numberOfPeople = model.createQuantity(numberOfPeopleURI,
				numberOfPeopleName);
		assertEquals(numberOfPeopleURI, numberOfPeople.uri());
		assertEquals(numberOfPeopleName, numberOfPeople.name());

		String usDollarsURI = unitsURI + "/usDollars";
		InternationalString usDollarsName = intlName("U. S. Dollars", "en");
		Unit usDollars = currency.createUnit(usDollarsURI, usDollarsName);
		assertEquals(usDollarsURI, usDollars.uri());
		assertEquals(usDollarsName, usDollars.name());
		assertEquals(currency, usDollars.quantity());

		String personsURI = unitsURI + "/persons";
		InternationalString personsName = intlName("Persons", "en");
		Unit persons = numberOfPeople.createUnit(personsURI, personsName);
		assertEquals(personsURI, persons.uri());
		assertEquals(personsName, persons.name());
		assertEquals(numberOfPeople, persons.quantity());

		String sumURI = aggregationOperatorsURI + "/sum";
		InternationalString sumName = intlName("Sum", "en", "Summe", "de");
		AggregationOperator sum = model.createAggregationOperator(sumURI,
				sumName);
		assertEquals(sumURI, sum.uri());
		assertEquals(sumName, sum.name());

		String avgURI = aggregationOperatorsURI + "/average";
		InternationalString avgName = intlName("Average", "en", "Durchschnitt",
				"de");
		AggregationOperator avg = model.createAggregationOperator(avgURI,
				avgName);
		assertEquals(avgURI, avg.uri());
		assertEquals(avgName, avg.name());

		String incomeURI = measuresURI + "/income";
		InternationalString incomeName = intlName("Income", "en", "Einkommen",
				"de");
		Measure income = model.createMeasure(incomeURI, incomeName, currency,
				avg);
		assertEquals(incomeURI, income.uri());
		assertEquals(incomeName, income.name());
		assertEquals(avg, income.aggregationOperator());
		assertEquals(currency, income.quantity());

		String populationURI = measuresURI + "/population";
		InternationalString populationName = intlName("Population", "en",
				"Einwohner", "de");
		Measure population = model.createMeasure(populationURI, populationName,
				numberOfPeople, sum);
		assertEquals(populationURI, population.uri());
		assertEquals(populationName, population.name());
		assertEquals(sum, population.aggregationOperator());
		assertEquals(numberOfPeople, population.quantity());

		String blsURI = datasetsURI + "/bls";
		InternationalString blsName = intlName(
				"The Bureau of Labor Statistics Employment Dataset", "en");
		Dataset bls = model.createDataset(blsURI, blsName);
		String blsCreator = "U.S. Bureau of Labor Statistics";
		bls.setCreator(blsCreator);
		String blsDescription = "The Bureau of Labor Statistics Employment Dataset. "
				+ "Downloaded and imported by the Institute for Visualization "
				+ "and Perception Research at UMass Lowell."
				+ " Original data files are located at "
				+ "ftp://ftp.bls.gov/pub/special.requests/cew/";
		bls.setDescription(blsDescription);
		assertEquals(blsURI, bls.uri());
		assertEquals(blsName, bls.name());
		assertEquals(blsCreator, bls.creator());
		assertEquals(blsDescription, bls.description());

		String blsYearsByStatesURI = dataCubesURI + "/blsYearsByStates";
		DataCube blsYearsByStates = bls.createDataCube(blsYearsByStatesURI);

		String blsYearsURI = blsYearsByStatesURI + "/years";
		DimensionInstance blsYears = blsYearsByStates.createDimensionInstance(
				blsYearsURI, years);
		blsYears.addRecord(year1990);
		blsYears.addRecord(year1991);

		String blsStatesURI = blsYearsByStatesURI + "/states";
		DimensionInstance blsStates = blsYearsByStates.createDimensionInstance(
				blsStatesURI, usStates);
		blsStates.addRecord(massachusetts);
		blsStates.addRecord(newYork);

		String blsIncomeURI = blsYearsByStatesURI + "/income";
		MeasureInstance blsIncome = blsYearsByStates.createMeasureInstance(
				blsIncomeURI, income, usDollars);

		String blsPopulationURI = blsYearsByStatesURI + "/population";
		MeasureInstance blsPopulation = blsYearsByStates.createMeasureInstance(
				blsPopulationURI, population, persons);

		Collection<DataCube> dataCubes = bls.listDataCubes();
		assertTrue(dataCubes != null);
		assertTrue(dataCubes.contains(blsYearsByStates));
		assertTrue(blsIncome != null);
		assertTrue(blsYearsByStates != null);
		assertTrue(blsYearsByStates.listMeasureInstances().contains(blsIncome));
		assertTrue(blsYearsByStates.listMeasureInstances().contains(
				blsPopulation));
		assertEquals(usStates, blsStates.level());

		blsYearsByStates.setValues(cellLocation(year1990, massachusetts),
				measureInstances(blsIncome, blsPopulation), values(36952,
						6022639));
		blsYearsByStates.setValues(cellLocation(year1991, massachusetts),
				measureInstances(blsIncome, blsPopulation), values(37563,
						6023471));
		blsYearsByStates.setValues(cellLocation(year1990, newYork),
				measureInstances(blsIncome, blsPopulation), values(37835,
						6084523));
		blsYearsByStates.setValues(cellLocation(year1991, newYork),
				measureInstances(blsIncome, blsPopulation), values(38463,
						9057371));

		double[] actual = new double[2];
		blsYearsByStates.getValues(cellLocation(year1990, massachusetts),
				measureInstances(blsIncome, blsPopulation), actual);
		double[] expected = values(36952.0, 6022639.0);
		for (int i = 0; i < actual.length; i++)
			assertEquals(expected[i], actual[i]);
	}

	private double[] values(double... values) {
		return values;
	}

	private List<MeasureInstance> measureInstances(
			MeasureInstance... measureInstances) {
		List<MeasureInstance> list = new ArrayList<MeasureInstance>();
		for (int i = 0; i < measureInstances.length; i++)
			list.add(measureInstances[i]);
		return list;
	}

	private List<Record> cellLocation(Record... records) {
		List<Record> list = new ArrayList<Record>();
		for (int i = 0; i < records.length; i++)
			list.add(records[i]);
		return list;
	}

	private LocalizedString locName(String name, String lang) {
		return new LocalizedString(name, lang);
	}

	private InternationalString intlName(String... namesAndLanguages) {
		if (namesAndLanguages.length % 2 != 0)
			throw new UDCException(
					"Error: attempted to create an international string missing a language specification (there must be an even number of arguments)");
		if (namesAndLanguages.length == 0)
			throw new UDCException(
					"Error: attempted to create an international string with no content!");

		Collection<LocalizedString> localizedStrings = new LinkedList<LocalizedString>();
		for (int i = 0; i < namesAndLanguages.length; i += 2) {
			String name = namesAndLanguages[i];
			String language = namesAndLanguages[i + 1];
			localizedStrings.add(new LocalizedString(name, language));
		}
		return new InternationalString(localizedStrings);
	}

	private UDCModel createUDCModel() {
		jdbcDataSource ds = new jdbcDataSource();
		ds.setDatabase("jdbc:hsqldb:mem:sqltest");
		ds.setUser("sa");
		ds.setPassword("");
		return new UDCModelSQL(ds);
	}

	/**
	 * Create the test case
	 * 
	 * @param testName
	 *            name of the test case
	 */
	public UDCModelSQLTest(String testName) {
		super(testName);
	}

	/**
	 * @return the suite of tests being tested
	 */
	public static Test suite() {
		return new TestSuite(UDCModelSQLTest.class);
	}

	/**
	 * Rigourous Test :-)
	 */
	public void testApp() {
		assertTrue(true);
	}
}
