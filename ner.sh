scriptdir=`dirname $0`
webdir=webpages_raw
outputdir=webpages/

for webfile in $webdir/*; do
	java -mx1000m -cp "$scriptdir/stanford-ner.jar:$scriptdir/lib/*" edu.stanford.nlp.ie.crf.CRFClassifier -loadClassifier $scriptdir/classifiers/english.muc.7class.distsim.crf.ser.gz -outputFormat inlineXML -textFile $webfile > ${outputdir}${webfile##*/}
done

