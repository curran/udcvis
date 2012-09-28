# Converts index.md (a Markdown file) to index.html.
#
# assumes the Node.js "marked" package is installed
# npm install marked
cat index.md | marked > index.html
