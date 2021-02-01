const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
  Category,
  Post,
  User,
} = require('../models/models');
let user;
router.get('/', async (req, res) => {
  const allPosts = await Category.find();
  for (post of allPosts) {
    await post.populate('goods').execPopulate();
  }
  res.render('main', { posts: allPosts, user });
});

router.post('/search', async (req, res) => {
  let allPosts;
  if (req.body.placeSelect == 'Вся Россия') {
    allPosts = await Post.find({
      title: { $regex: req.body.title },
    });
  } else {
    allPosts = await Post.find({
      title: { $regex: req.body.title },
      location: req.body.placeSelect,
    });
  }
  res.render('searchResults', {
    posts: allPosts,
    location: req.body.placeSelect,
    user,
  });
});

router.get('/create', (req, res) => {
  if (user) {
    res.render('create', { user });
  } else {
    res.render('register', { warning: true });
  }
});

router.post('/create', async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image || 'https://pngimg.com/uploads/box/box_PNG114.png',
    price: req.body.price,
    location: req.body.locationSelect,
  });
  await newPost.save();
  await Category.updateOne(
    { name: req.body.categorySelect },
    { $push: { goods: newPost._id } }
  );
  await User.updateOne(
    { login: user.login },
    { $push: { goods: newPost._id } }
  );
  user = await User.findOne({ login: user.login });
  console.log(user);
  res.redirect('/');
});

router.get('/register', async (req, res) => {
  res.render('register');
});
router.get('/account', async (req, res, next) => {
  if (user) {
    await user.populate('goods').execPopulate();
    res.render('account', { user });
  } else {
    res.send(
      'Такого аккаунта нет, <a href="/">вернуться на главную страницу</a>'
    );
    next();
  }
});

router.post('/register', async (req, res) => {
  user = await User.findOne({
    login: req.body.login,
    password: req.body.password,
  });
  console.log(user);
  if (user) {
    res.redirect('/');
  } else {
    user = new User({
      login: req.body.login,
      password: req.body.password,
    });
    await user.save();
    res.redirect('/');
  }
});

router.get('/categories', async (req, res) => {
  const allCategories = await Category.find();
  let categories = [];
  for (cat of allCategories) {
    categories.push(cat.name);
  }
  console.log(categories);
  res.render('categories', { categories: categories, user });
});

router.get('/categories/:id', async (req, res) => {
  const allPosts = await Category.find({ name: req.params.id });
  for (post of allPosts) {
    await post.populate('goods').execPopulate();
  }
  res.render('main', { posts: allPosts, user });
});

router.get('/delete/:id', async (req, res) => {
  await Post.deleteOne({ _id: req.params.id });
  res.redirect('/account');
});
module.exports = router;
