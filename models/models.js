const mongoose = require('mongoose');
const Category = mongoose.model('Category', {
  name: { type: String, default: 'Без категории' },
  description: { type: String, default: 'Товары без категории' },
  goods: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

const Post = mongoose.model('Post', {
  title: { type: String, default: 'Новое объявление' },
  description: { type: String, default: 'Описание товара или услуги' },
  image: {
    type: String,
    default: 'https://pngimg.com/uploads/box/box_PNG114.png',
  },
  location: {
    type: String,
    default: 'Вся Россия',
  },
  price: {
    type: String,
    default: 'Бесплатно',
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

const User = mongoose.model('User', {
  login: String,
  password: String,
  goods: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

module.exports = { Category, Post, User };
