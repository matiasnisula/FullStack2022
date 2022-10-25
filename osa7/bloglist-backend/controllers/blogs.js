const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const userExtractor = require("../utils/middleware").userExtractor;

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const id = request.params.id;
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user,
    comments: body.comments,
  };
  const result = await Blog.findByIdAndUpdate(id, blog, { new: true });
  if (result) {
    response.json(result);
  } else {
    response.status(400).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user,
  };
  const result = await Blog.findByIdAndUpdate(id, blog, { new: true });
  if (result) {
    response.json(result);
  } else {
    response.status(400).end();
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;
  const user = request.user;

  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(400).json({
      error: "Blog doesnt exists",
    });
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({
      error: "No permission to delete this blog",
    });
  }
  const result = await Blog.findByIdAndRemove(id);

  if (result) {
    response.status(204).end();
  } else {
    response.status(400).end();
  }
});

module.exports = blogsRouter;
