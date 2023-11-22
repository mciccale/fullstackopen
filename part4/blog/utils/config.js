require('dotenv').config();

const { MONGODB_URI, NODE_ENV, PORT, TEST_MONGODB_URI } = process.env;

module.exports = {
  PORT,
  MONGODB_URI: NODE_ENV === 'test' ? MONGODB_URI : TEST_MONGODB_URI,
};
