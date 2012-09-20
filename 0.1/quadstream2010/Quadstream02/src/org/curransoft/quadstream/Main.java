package org.curransoft.quadstream;

/**
 * The goal: Read a shapefile, simplify it, draw it on the screen.
 */
public class Main {

	public static void main(String[] args) {
		String infile = "/home/curran/data/shapes/usStates/tl_2009_us_state.shp";
		
		String outDirectory = "usStates";
		
		
		final Quadstream q = new Quadstream(infile, outDirectory, 7, 16);

		//start a thread for progress reporting
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
