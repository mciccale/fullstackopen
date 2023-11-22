const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const {
    body: { author, likes, title, url },
  } = req;

  if (!author || !title) {
    res.status(400).end();
    return;
  }
  const newBlog = new Blog({
    author,
    title,
    url,
    likes: likes ?? 0,
  });

  const savedBlog = await newBlog.save();
  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
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

  console.log(updatedBlog);

  res.json(updatedBlog);
});

module.exports = blogsRouter;
