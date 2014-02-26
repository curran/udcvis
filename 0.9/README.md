This directory contains simple data integration prototypes illustrating my process of figuring out and generalizing data integration data structures and algorithms.

 * `integrationTest_simple` implements a very simple data integration scenario with a hierarchy and two tables. Keys are the same between the hierarchy and tables. The task is to produce a hierarchy with associated values for each node drawn from the two tables.
 * `integrationTest_codes` implements a more complex data integration scenario where keys do not match between the hierarchy and one of the tables. This scenario requires a concordance table that declares equivalent keys between the two sources.
 * `integrationTest_scales` implements an even more complex data integration scenario where keys do not match between the hierarchy and one of the tables, and the scale factor does not match between the two tables.
