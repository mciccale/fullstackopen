const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    author: 1,
    title: 1,
    url: 1,
  });
  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { name, username, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'A password must be specified' });
  }

  if (password.length < 3) {
    return res.status(400).json({
      error: 'The password specified must have at least 3 characters',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const savedUser = await new User({ name, username, passwordHash }).save();

  res.status(201).json(savedUser);
});

module.exports = usersRouter;
