const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./testHelper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  console.log('test database cleared');

  const promiseArray = helper.listWithManyBlogs.map((blog) => {
    return new Blog(blog).save();
  });
  await Promise.all(promiseArray);

  console.log('test database populated succesfully');
});

test('all blogs are returned as JSON', async () => {
  console.log('entered test');

  const { body } = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(body).toHaveLength(helper.listWithManyBlogs.length);
});

test('all blogs have id property', async () => {
  console.log('entered test');

  const { body } = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  body.forEach(({ id }) => expect(id).toBeDefined());
});

test('new blog is created succesfully', async () => {
  console.log('entered test');

  const newBlog = {
    title: 'My new blog',
    author: 'Marco Ciccale',
    url: 'https://github.com/mciccale',
    likes: 100,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1);

  const blogsWithoutId = blogsAtEnd.map((blog) => {
    return { ...blog, id: undefined };
  });
  expect(blogsWithoutId).toContainEqual(newBlog);
});

test('new blog without likes property defaults it to 0', async () => {
  console.log('entered test');

  const newBlog = {
    title: 'My new blog',
    author: 'Marco Ciccale',
    url: 'https://github.com/mciccale',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1);

  const blogsWithoutId = blogsAtEnd.map((blog) => {
    return { ...blog, id: undefined };
  });
  expect(blogsWithoutId).toContainEqual({ ...newBlog, likes: 0 });
});

test('new blog without title property returns 400 code', async () => {
  console.log('entered test');

  const newBlog = {
    author: 'Marco Ciccale',
    url: 'https://github.com/mciccale',
    likes: 300,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
});

test('delete an existent blog', async () => {
  console.log('entered test');

  const blogToDelete = (await helper.blogsInDb())[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length - 1);

  const blogsWithoutId = blogsAtEnd.map((blog) => {
    delete blog.id;
    return blog;
  });
  expect(blogsWithoutId).not.toContainEqual(blogToDelete);
});

test('updating the number of likes of a blog', async () => {
  console.log('entered test');

  const { id } = (await helper.blogsInDb())[0];

  const updatedBlog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 70,
  };

  await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(200);

  const blogsAtEndWithoutId = (await helper.blogsInDb()).map((blog) => {
    delete blog.id;
    return blog;
  });
  expect(blogsAtEndWithoutId).toContainEqual(updatedBlog);
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log('database connection closed');
});
