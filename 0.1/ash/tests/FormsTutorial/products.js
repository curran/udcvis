var products = [
{
  id: 1,
  name: 'Mac Book Pro',
  description: 'Apple 13 inch macbook',
  price: 1000
},
{
  id: 2,
  name: 'iPad',
  description: 'Apple iPad',
  price: 500
},
{
  id: 3,
  name: 'iPhone',
  description: 'Apple iPhone',
  price: 1000
}
];

module.exports.all = products;

module.exports.find = function(id){
  id = parseInt(id, 10);
  for(i in products)
    if(products[i].id == id)
      return products[i];
};

module.exports.new = function() {
  return {
    name:'',
    description:'',
    price: 0
  };
}

module.exports.insert = function(product) {
  var id = products.length;
  product.id = id;
  products[id - 1] = product;
  return id;
}

module.exports.set = function(id, product) {
  id = parseInt(id, 10);
  product.id = id;
  products[id - 1] = product;
};
