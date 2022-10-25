const blog = require("../models/blog");

const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    const res = blogs.reduce((prev, blog) => {
        return prev + blog.likes;
    }, 0);
    return res;
};

const favouriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const res = blogs.reduce((prev, blog) => {
        return (blog.likes > prev.likes) ? blog : prev;
    });
    return {
        title: res.title, 
        author: res.author, 
        likes: res.likes
    };
};

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;

    let authorWithMostBlogs = blogs[0].author;
    let numMostBlogs = 1;
    const mapMostBlogs = new Map();

    blogs.forEach((blog) => {
        const authorBlogCount = mapMostBlogs.get(blog.author);
        mapMostBlogs.set(blog.author, 
            (authorBlogCount == undefined) ? 1 : authorBlogCount+1);
        if (authorBlogCount+1 > numMostBlogs) {
            numMostBlogs = authorBlogCount+1;
            authorWithMostBlogs = blog.author;
        }
    });

    return ({
        author: authorWithMostBlogs,
        blogs: numMostBlogs
    });
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;

    let authorWithMostLikes = blogs[0].author;
    let numLikes = blogs[0].likes;
    const mapMostLikes = new Map();

    blogs.forEach((blog) => {
        const authorLikeCount = mapMostLikes.get(blog.author);
        mapMostLikes.set(blog.author, 
            (authorLikeCount == undefined) ? blog.likes : authorLikeCount+blog.likes);
        if (authorLikeCount+blog.likes > numLikes) {
            numLikes = authorLikeCount+blog.likes;
            authorWithMostLikes = blog.author;
        }
    });
    return ({
        author: authorWithMostLikes,
        likes: numLikes
    });
};

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
};