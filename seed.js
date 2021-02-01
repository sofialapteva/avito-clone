const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/avito', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { Category, Post } = require('./models/models');

(async () => {
  let ids = [];
  for (let i = 0; i < 5; i++) {
    let post = new Post({});
    await post.save();
    ids.push(post._id);
  }
  let category = new Category({
    goods: ids,
  });
  await category.save();
  mongoose.disconnect();
})();
