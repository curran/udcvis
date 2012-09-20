package org.curransoft.quadstream;

import org.geotools.factory.GeoTools;


public class QuadStreamTest {

	public static void main(String[] args) {
		
		
		System.out.println( "Hello GeoTools:" + GeoTools.getVersion() );
		
		
		
		
		
//		String infile = "/home/curran/data/shapes/usStates/tl_2009_us_state.dbf";
//		String infile = "/home/curran/data/shapes/usStates/tl_2000/tl_2009_us_state00.dbf";
		String infile = "/home/curran/data/shapes/usStates/tl_2009_us_state.shp";
//		String infile = "/home/curran/data/shapes/usStates/usgs_atlas/statesp020.dbf";
//		String infile = "/home/curran/data/shapes/us/states/census_cartographic/st99_d00.shp";
		
		
//		/home/curran/data/shapes/usStates/tl_2000
//		
//		String infile =  "/home/curran/data/shapes/usStatesSimple/usa_st.dbf";
		String outfile = "us.sql";
		String tablePrefix = "us";
		final Quadstream q = new Quadstream(infile, outfile, tablePrefix, 7, 16);

		//start a thread for progress reporting
		//prints percentage done every half second
		final int waitTimeMillis = 500;
		(new Thread(new Runnable() {
			public void run() {
				double percentDone = 0;
				do {
					if(q.hasFailed()){
						System.out.println("failed: "+q.getErrorMessage());
						break;
					}
					percentDone = q.getPercentDone();
					System.out.println("percentDone (" + q.getPhase() + ") = "
							+ percentDone);
					try {
						Thread.sleep(waitTimeMillis);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				} while (percentDone < 100);
			}
		})).start();

		//execute Quadstream in the current thread.
		try {
			long t = System.currentTimeMillis();
			q.execute();
			t = System.currentTimeMillis() - t;
			System.out.println("Total took " + t + " ms.");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
