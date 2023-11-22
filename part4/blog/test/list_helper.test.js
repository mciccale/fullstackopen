const listHelper = require('../utils/list_helper');

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

const listWithManyBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

describe('total likes', () => {
  test('when list has zero blogs, equals zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('when list has many blogs, equals the sum of the likes of all blogs', () => {
    const result = listHelper.totalLikes(listWithManyBlogs);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('when list has zero blogs, equals undefined', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBeUndefined();
  });

  test('when list has one blog, return the blog in the specified format', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    const expected = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    };

    expect(result).toStrictEqual(expected);
  });

  test('when list has many blogs, return the blog with most likes in the specified format', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs);
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };

    expect(result).toStrictEqual(expected);
  });
});

describe('author with most blogs', () => {
  test('when list has zero blogs, equals undefined', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBeUndefined();
  });

  test('when list has one blog, equals the author and one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    const expected = { author: 'Edsger W. Dijkstra', blogs: 1 };
    expect(result).toStrictEqual(expected);
  });

  test('when list has many blogs, equals the author with most likes across all his blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs);
    const expected = { author: 'Robert C. Martin', blogs: 3 };
    expect(result).toStrictEqual(expected);
  });
});

describe('most liked author', () => {
  test('when list has zero blogs, equals undefined', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBeUndefined();
  });

  test('when list has one blog, equals the author and the likes of the blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    const expected = { author: 'Edsger W. Dijkstra', likes: 5 };
    expect(result).toStrictEqual(expected);
  });

  test('when list has many blogs, equals the author with most likes across all his blogs', () => {
    const result = listHelper.mostLikes(listWithManyBlogs);
    const expected = { author: 'Edsger W. Dijkstra', likes: 17 };
    expect(result).toStrictEqual(expected);
  });
});
