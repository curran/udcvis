var products = [
{
  id:1,
  name : 'Mac Book Pro',
  description: 'Apple 13 inch notebook',
  price: 1000
},
{
  id:2,
  name : 'iPad',
  description: 'Apple iPad',
  price: 899
}
];

module.exports.all = products;

module.exports.find = function(id){
  id = parseInt(id,10);
  for(i in products)
    if(products[i].id == id)
      return products[i];
}
