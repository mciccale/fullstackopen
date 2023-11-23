const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');
const { SECRET } = require('../utils/config');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });
  res.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const {
    user,
    token,
    body: { author, likes, title, url },
  } = req;

  const decodedToken = jwt.verify(token, SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }

  if (!author || !title) {
    return res
      .status(400)
      .json({ error: 'Author and title fields are required' });
  }

  const newBlog = new Blog({
    author,
    title,
    url,
    user: user._id,
    likes: likes ?? 0,
  });

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const {
    user,
    token,
    params: { id },
  } = req;

  const decodedToken = jwt.verify(token, SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }

  const blog = await Blog.findById(id);

  if (!blog || !user) {
    return res.status(404).json({ error: 'not found' });
  }

  if (blog.user.toString() !== user._id.toString()) {
    return res
      .status(401)
      .json({ error: 'you are not authorized to delete this blog' });
  }

  await Blog.findByIdAndDelete(id);
  res.status(204).end();
});

blogsRouter.put('/:id', middleware.userExtractor, async (req, res) => {
  const { author, likes, title, url } = req.body;

  const blog = {
    author,
    likes,
    title,
    url,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });

  res.json(updatedBlog);
});

module.exports = blogsRouter;
