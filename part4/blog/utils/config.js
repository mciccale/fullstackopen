require('dotenv').config();

const { MONGODB_URI, NODE_ENV, PORT, TEST_MONGODB_URI, SECRET } = process.env;

module.exports = {
  PORT,
  NODE_ENV,
  SECRET,
  MONGODB_URI: NODE_ENV === 'test' ? TEST_MONGODB_URI : MONGODB_URI,
};
