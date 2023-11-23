const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');
const { SECRET } = require('./config');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: err.message });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  }

  next(err);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  req.token =
    authorization && authorization.startsWith('Bearer ')
      ? authorization.replace('Bearer ', '')
      : null;

  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }

  req.user = await User.findById(decodedToken.id);

  next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
