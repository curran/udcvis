# Converts index.md (a Markdown file) to index.html.
#
# assumes the Node.js "marked" package is installed
# npm install marked

# Build the top-level index.html from README.md
htmlFile="index.html"
FILE_NAME="README.md"
sed -e "s/latex.css/0.2\/pages\/latex.css/g" ./0.2/pages/header.txt > $htmlFile
cat $FILE_NAME | marked >> $htmlFile
cat 0.2/pages/analytics.txt >> $htmlFile
## Set the page ID for Disqus comments
sed -e "s/\${pageId}/udcvis_${FILE_NAME%.*}/g" ./0.2/pages/footer.txt >> $htmlFile

# Build the 0.1 index
echo "Building 0.1 index."
cd 0.1
cat $FILE_NAME | marked >> $htmlFile
cat ../0.2/pages/analytics.txt >> $htmlFile
cd ../

# Build the 0.2 pages
echo "Building 0.2 pages."
cd 0.2/pages
bash build.sh
cd ../../


# Build the 0.2 docs
echo "Building 0.2 docs."
echo `pwd`
cd 0.2/modules
docco *.js
cd ash
docco *.js
cd ../../../
