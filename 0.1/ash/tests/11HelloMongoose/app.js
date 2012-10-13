var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
    
var PostSchema = new Schema({
  title: String,
  body: String,
  date: Date
});

mongoose.connect('mongodb://localhost/mydatabase');
mongoose.model('Post',PostSchema);
var Post = mongoose.model('Post');

var post = new Post();
post.title = 'first post';
post.body = 'post body';
post.date = Date.now();

post.save(function(err){
  if(err){ throw err; }
  console.log('saved');
  mongoose.disconnect();
});

Post.find({},function(err, posts){
  posts.forEach(function(post){
    console.log(post);
  });
});
