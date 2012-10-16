# Converts index.md (a Markdown file) to index.html.
#
# assumes the Node.js "marked" package is installed
# npm install marked

htmlFile="index.html"
FILE_NAME="README.md"
sed -e "s/latex.css/0.2\/pages\/latex.css/g" ./0.2/pages/header.txt > $htmlFile
cat $FILE_NAME | marked >> $htmlFile
## Set the page ID for Disqus comments
sed -e "s/\${pageId}/udcvis_${FILE_NAME%.*}/g" ./0.2/pages/footer.txt >> $htmlFile
