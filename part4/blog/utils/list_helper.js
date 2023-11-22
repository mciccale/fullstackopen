/* eslint-disable-next-line no-unused-vars */
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, { likes }) => acc + likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const initialValue = { author: '', likes: -1, title: '' };

  return blogs.reduce((blogWithMaxLikes, { title, author, likes }) => {
    return likes > blogWithMaxLikes.likes
      ? { title, author, likes }
      : blogWithMaxLikes;
  }, initialValue);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const authorBlogsMap = new Map();

  blogs.forEach(({ author }) => {
    const authorBlogs = authorBlogsMap.get(author);
    if (!authorBlogs) {
      authorBlogsMap.set(author, 1);
    } else {
      authorBlogsMap.set(author, authorBlogs + 1);
    }
  });

  let authorWithMostBlogs = { author: '', blogs: 0 };

  authorBlogsMap.forEach((authorBlogs, author) => {
    if (authorBlogs > authorWithMostBlogs.blogs) {
      authorWithMostBlogs = {
        author,
        blogs: authorBlogs,
      };
    }
  });

  return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const authorLikesMap = new Map();

  blogs.forEach(({ author, likes }) => {
    const authorLikes = authorLikesMap.get(author);
    if (!authorLikes) {
      authorLikesMap.set(author, likes);
    } else {
      authorLikesMap.set(author, authorLikes + likes);
    }
  });

  let authorWithMostLikes = { author: '', likes: -1 };

  authorLikesMap.forEach((authorTotalLikes, author) => {
    if (authorTotalLikes > authorWithMostLikes.likes) {
      authorWithMostLikes = {
        author,
        likes: authorTotalLikes,
      };
    }
  });

  return authorWithMostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
