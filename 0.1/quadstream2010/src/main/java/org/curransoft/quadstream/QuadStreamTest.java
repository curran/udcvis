package org.curransoft.quadstream;


public class QuadStreamTest {

	public static void main(String[] args) {
//		String infile = "/home/curran/data/shapes/usStates/tl_2009_us_state.dbf";
//		String infile = "/home/curran/data/shapes/usStates/tl_2000/tl_2009_us_state00.dbf";
		String infile = "/home/curran/data/shapes/us/states/tiger_line/tl_2009_us_state.shp";
//		String infile = "/home/curran/data/shapes/usStates/usgs_atlas/statesp020.dbf";
//		String infile = "/home/curran/data/shapes/us/states/census_cartographic/st99_d00.shp";
		
		
//		/home/curran/data/shapes/usStates/tl_2000
//		
//		String infile =  "/home/curran/data/shapes/usStatesSimple/usa_st.dbf";
		String outfile = "us.sql";
		String tablePrefix = "us";
		final Quadstream q = new Quadstream(infile, outfile, tablePrefix, 7, 16);

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
						Thread.sleep(500);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				} while (percentDone < 100);
			}
		})).start();

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
