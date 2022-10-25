const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const initialBlogs = require("./testData").blogs;

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("returned blog has a propertie named id", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

test("a blog with valid properties can be added", async () => {
  const blogToBeAdded = {
    title: "Testi",
    author: "abc",
    url: "www.testi.fi",
    likes: 10,
  };
  await api.post("/api/blogs").send(blogToBeAdded).expect(201);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length + 1);
  const foundAddedBlog = response.body.find((blog) => {
    return blog.title === "Testi" && blog.author === "abc";
  });
  expect(foundAddedBlog).toBeDefined();
});

test("a blog without propertie likes gets deafult value 0", async () => {
  const blogToBeAdded = {
    title: "Blog without likes",
    author: "aaa",
    url: "www.blogwithoutlikes.fi",
  };
  await api.post("/api/blogs").send(blogToBeAdded).expect(201);

  const response = await api.get("/api/blogs");
  const foundAddedBlog = response.body.find((blog) => {
    return blog.title === "Blog without likes" && blog.author === "aaa";
  });
  expect(foundAddedBlog.likes).toBe(0);
});

test("a blog without properties title or url doesnt get added", async () => {
  const blogToBeAdded = {
    author: "aaa",
  };
  await api.post("/api/blogs").send(blogToBeAdded).expect(400);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("a blog that exists can be deleted with correct id", async () => {
  let response = await api.get("/api/blogs");
  const blogToBeDeleted = response.body[0];

  await api.delete(`/api/blogs/${blogToBeDeleted.id}`).expect(204);

  response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length - 1);

  const blogExists = response.body.find((blog) => {
    return (
      blog.id === blogToBeDeleted.id &&
      blog.title === blogToBeDeleted.title &&
      blog.author === blogToBeDeleted.author
    );
  });
  expect(blogExists).not.toBeDefined();
});

test("blogs cant be deleted with invalid id", async () => {
  let invalidId = "111";

  await api.delete(`/api/blogs/${invalidId}`).expect(400);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("blog properties can be updated with valid id", async () => {
  let response = await api.get("/api/blogs");
  const blogToBeUpdated = response.body[5];

  const updatedBlog = {
    title: "updated title",
    author: "updated author",
    url: "www.updated.fi",
    likes: 40,
  };
  await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send(updatedBlog)
    .expect(200);

  response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
  const updatedBlogExists = response.body.find((blog) => {
    return (
      blog.id === blogToBeUpdated.id &&
      blog.title === updatedBlog.title &&
      blog.author === updatedBlog.author &&
      blog.url === updatedBlog.url &&
      blog.likes === updatedBlog.likes
    );
  });
  expect(updatedBlogExists).toBeDefined();
});

test("blog properties cant be updated with invalid id, expect status code 400", async () => {
  const invalidId = "1234";

  const updatedBlog = {
    title: "This should not to be updated",
    author: "error",
    url: "www.notupdated.fi",
    likes: 12,
  };
  await api.put(`/api/blogs/${invalidId}`).send(updatedBlog).expect(400);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);

  const updatedBlogExists = response.body.find((blog) => {
    return (
      blog.title === updatedBlog.title &&
      blog.author === updatedBlog.author &&
      blog.url === updatedBlog.url &&
      blog.likes === updatedBlog.likes
    );
  });
  expect(updatedBlogExists).not.toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
