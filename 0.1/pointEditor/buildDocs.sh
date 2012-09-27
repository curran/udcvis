rm -r docs
cd scripts/
r.js -o name=main out=../all-modules.js baseUrl=. optimize=none
cd ../
docco all-modules.js 
rm all-modules.js 
