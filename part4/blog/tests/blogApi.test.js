const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./testHelper');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const promiseArray = helper.listWithManyBlogs.map((blog) => {
    return new Blog(blog).save();
  });

  await Promise.all(promiseArray);
});

describe('when there is initially blogs saved', () => {
  test('all blogs are returned as JSON', async () => {
    const { body } = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(body).toHaveLength(helper.listWithManyBlogs.length);
  });

  test('all blogs have id property', async () => {
    const { body } = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    body.forEach(({ id }) => expect(id).toBeDefined());
  });
});

describe('creating a new blog', () => {
  let jwtToken;

  beforeEach(async () => {
    const user = {
      username: 'root',
      name: 'Root',
      password: 'sekret',
    };

    await User.deleteMany({});

    const passwordHash = await bcrypt.hash(user.password, 10);
    await new User({
      passwordHash,
      name: user.name,
      username: user.username,
    }).save();

    const {
      body: { token },
    } = await api.post('/api/login').send(user).expect(200);

    jwtToken = `Bearer ${token}`;
  });

  test('creation fails without jwt', async () => {
    const newNote = {
      title: 'Mi blog sobre como no usar jwt :)',
      author: 'Marco Ciccale',
      url: 'https://github.com/mciccale',
      likes: 100,
    };

    await api.post('/api/blogs').send(newNote).expect(401);
  });

  test('new blog is created succesfully', async () => {
    const newBlog = {
      title: 'Mi blog personal',
      author: 'Marco Ciccale',
      url: 'https://github.com/mciccale',
      likes: 100,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', jwtToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1);

    const titles = blogsAtEnd.map(({ title }) => title);
    expect(titles).toContainEqual(newBlog.title);
  });

  test('new blog without likes property defaults it to 0', async () => {
    const newBlog = {
      title: 'My new blog',
      author: 'Marco Ciccale',
      url: 'https://github.com/mciccale',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', jwtToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1);

    const titlesAndLikes = blogsAtEnd.map(({ title, likes }) => ({
      title,
      likes,
    }));
    expect(titlesAndLikes).toContainEqual({ title: newBlog.title, likes: 0 });
  });

  test('new blog without title property returns 400 code', async () => {
    const newBlog = {
      author: 'Marco Ciccale',
      url: 'https://github.com/mciccale',
      likes: 300,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', jwtToken)
      .send(newBlog)
      .expect(400);
  });
});

describe('registering a user', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const promiseArray = helper.listWithManyUsers.map(async (user) => {
      const { name, username, password } = user;
      const passwordHash = await bcrypt.hash(password, 10);
      return new User({ name, username, passwordHash }).save();
    });

    await Promise.all(promiseArray);
  });

  test('succeeds with valid data', async () => {
    const newUser = {
      username: 'mciccale',
      name: 'Marco',
      password: 'password',
    };

    await api.post('/api/users').send(newUser).expect(201);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.listWithManyUsers.length + 1);

    const usernames = usersAtEnd.map(({ username }) => username);
    expect(usernames).toContain(newUser.username);
  });

  test('fails with no username', async () => {
    const newUser = {
      name: 'Marco',
      password: 'password',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });

  test('fails with no password', async () => {
    const newUser = {
      username: 'mciccale',
      name: 'Marco',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });

  test('fails with username with less than 3 characters', async () => {
    const newUser = {
      username: 'mc',
      name: 'Marco',
      password: 'password',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });

  test('fails with password with less than 3 characters', async () => {
    const newUser = {
      username: 'mciccale',
      name: 'Marco',
      password: 'pw',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });
});

// describe('deleting an existing blog', () => {
//   let jwtToken;

//   beforeEach(async () => {
//     const user = {
//       username: 'root',
//       name: 'Root',
//       password: 'sekret',
//     };

//     await User.deleteMany({});

//     const passwordHash = await bcrypt.hash(user.password, 10);
//     await new User({
//       passwordHash,
//       name: user.name,
//       username: user.username,
//     }).save();

//     const {
//       body: { token },
//     } = await api.post('/api/login').send(user).expect(200);

//     jwtToken = `Bearer ${token}`;
//   });

//   test('delete fails without jwt', async () => {
//     const [blogToDelete] = await helper.blogsInDb();

//     await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
//   });

//   test('delete an existent blog', async () => {
//     const [blogToDelete] = await helper.blogsInDb();

//     await api
//       .delete(`/api/blogs/${blogToDelete.id}`)
//       .set('Authorization', jwtToken)
//       .expect(204);

//     const blogsAtEnd = await helper.blogsInDb();
//     expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length - 1);

//     const titles = blogsAtEnd.map(({ title }) => title);
//     expect(titles).not.toContainEqual(blogToDelete.title);
//   });
// });

// describe('updating a blog', () => {
//   test('updating the number of likes of a blog', async () => {
//     const { id } = (await helper.blogsInDb())[0];

//     const updatedBlog = {
//       title: 'React patterns',
//       author: 'Michael Chan',
//       url: 'https://reactpatterns.com/',
//       likes: 70,
//     };

//     await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(200);

//     const blogsAtEndWithoutId = (await helper.blogsInDb()).map((blog) => {
//       delete blog.id;
//       return blog;
//     });
//     expect(blogsAtEndWithoutId).toContainEqual(updatedBlog);
//   });
// });

afterAll(async () => {
  await mongoose.connection.close();
});
