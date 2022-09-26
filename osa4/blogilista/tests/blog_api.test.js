const mongoose = require("mongoose");
const supertest = require("supertest");
const { response } = require("../app");
const app = require("../app");
const Blog = require("../models/blog");
const initialBlogs = require("./testDataBlogs");

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
        likes: 10
    };
    await api
        .post("/api/blogs")
        .send(blogToBeAdded)
        .expect(201);

    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(initialBlogs.length + 1);
    const foundAddedBlog = response.body.find(blog => {
        return blog.title === "Testi" && blog.author === "abc";
    });
    expect(foundAddedBlog).toBeDefined();
});

test("a blog without propertie likes gets deafult value 0", async () => {
    const blogToBeAdded = {
        title: "Blog without likes",
        author: "aaa",
        url: "www.blogwithoutlikes.fi"
    };
    await api
        .post("/api/blogs")
        .send(blogToBeAdded)
        .expect(201);
    
    const response = await api.get("/api/blogs");
    const foundAddedBlog = response.body.find(blog => {
        return blog.title === "Blog without likes"
            && blog.author === "aaa";
    });
    expect(foundAddedBlog.likes).toBe(0);
    
});

test("a blog without properties title or url doesnt get added", async () => {
    const blogToBeAdded = {
        author: "aaa"
    };
    await api
        .post("/api/blogs")
        .send(blogToBeAdded)
        .expect(400);
    
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(initialBlogs.length);
    
});


afterAll(() => {
    mongoose.connection.close();
});