const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");


blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate("user", {username: 1, name: 1});
    
    response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
    const body = request.body;
    const user = await User.findOne({});

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();
    response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
    const id = request.params.id;
    const body = request.body;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    };
    const result = await Blog.findByIdAndUpdate(id, blog, {new: true});
    if (result) {
        response.json(result);
    } else {
        response.status(400).end();
    }
});

blogsRouter.delete("/:id", async (request, response) => {
    const id = request.params.id;
    const result = await Blog.findByIdAndRemove(id);
    if (result) {
        response.status(204).end();
    } else {
        response.status(400).end();
    }
});

module.exports = blogsRouter;