const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');

const app = express();

require('dotenv').config()
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// view engine setup
app.set('views', 'views');
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', indexRouter);

app.listen(process.env.PORT);
