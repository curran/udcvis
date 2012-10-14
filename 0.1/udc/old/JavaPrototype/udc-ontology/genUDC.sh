export JENAROOT=/home/curran/opt/Jena-2.6.3
$JENAROOT/bin/schemagen -i udc.owl -n UDC --owl --ontology --package org.ivpr.udc.sql -o UDC.java
cp UDC.java ../../udc-sql/code/udc-sql-04/src/main/java/org/ivpr/udc/sql/

