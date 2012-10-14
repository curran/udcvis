export JENAROOT=/home/curran/opt/Jena-2.6.3
$JENAROOT/bin/schemagen -i label.owl -n LABEL --owl --ontology --package org.ivpr.udc.vocabularies -o LABEL.java
cp LABEL.java ../../udc-sql/code/udc-sql-03/src/main/java/org/ivpr/udc/vocabularies

