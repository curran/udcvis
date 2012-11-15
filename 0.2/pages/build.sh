cp ../README.md ./md/index.md
rm *.html
echo Compiling:
for FILE_NAME in `ls md`
do
  htmlFile="${FILE_NAME%.*}.html"
  echo " * $FILE_NAME"
  cat header.txt > $htmlFile
  cat md/$FILE_NAME | marked >> $htmlFile
  ## Set the page ID for Disqus comments
  cat analytics.txt >> $htmlFile
  sed -e "s/\${pageId}/udcvis_02_${FILE_NAME%.*}/g" footer.txt >> $htmlFile
done
rm ./md/index.md
echo Done.
