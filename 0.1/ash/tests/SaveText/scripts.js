
var scripts = [
{
  name: 'A',
  content: 'Apple 13 inch macbook'
},
{
  name: 'B',
  content: 'Apple iPad'
},
{
  name: 'C',
  content: 'Apple iPhone'
}
];

module.exports.all = scripts;

module.exports.find = function(name){
  for(i in scripts)
    if(scripts[i].name == name)
      return scripts[i];
};

module.exports.insertNew = function(name) {
  scripts.push({
    name:name,
    content:''
  });
}

module.exports.setContent = function(name, content) {
  for(i in scripts)
    if(scripts[i].name == name){
      scripts[i].content = content;
      break;
    }
};
