const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
    const auth = request.get("authorization");
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        return auth.substring(7);
    }
    return null;

}

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate("user", {username: 1, name: 1});
    
    response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
    const body = request.body;
    const token = getTokenFrom(request);
    const decodedToken = jwt.verify(token, process.env.SECRET);


    if (!token || !decodedToken.id) {
        return response
            .status(401)
            .json({
                error: "token missing or invalid"
            });
    }
    
    const user = await User.findOne({_id: decodedToken.id});

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
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