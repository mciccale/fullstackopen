const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
const blogsRouter = require('./controllers/blogs');
const config = require('./utils/config');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const usersRouter = require('./controllers/users');

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);

app.use(middleware.errorHandler);

module.exports = app;
