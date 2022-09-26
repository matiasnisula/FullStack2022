const listHelper = require("../utils/list_helper");

const blogs = require("./testDataBlogs");


test("dummy returns one", () => {
    const blogsEmpty = [];

    const result = listHelper.dummy(blogsEmpty);
    expect(result).toBe(1);
});

describe("total likes", () => {
    

    const blogsEmpty = [];
    const blogsWithOneItem = [].concat(blogs[0]);

    test("of empty list is zero", () => {
        const result = listHelper.totalLikes(blogsEmpty);
        expect(result).toBe(0);
    });

    test("when list has only one blog equals the likes of that", () => {
        const result = listHelper.totalLikes(blogsWithOneItem);
        expect(result).toBe(7);
    });

    test("list with more than one blog is calculated right", () => {
        const result = listHelper.totalLikes(blogs);
        expect(result).toBe(36);
    })


});

describe("favourite blog with most likes", () => {

    test("of empty list is null", () => {
        const result = listHelper.favouriteBlog([]);
        expect(result).toEqual(null);
    });

    test("when list has only one blog returns that blog", () => {
        const result = listHelper.favouriteBlog([].concat(blogs[3]));
        const correctBlog = {
            title: "First class tests",
            author: "Robert C. Martin",
            likes: 10
        };

        expect(result).toEqual(correctBlog);
    });

    test("list with more than one blog returns correct blog", () => {
        const result = listHelper.favouriteBlog(blogs);
        const correctBlog = {
            title: blogs[2].title,
            author: blogs[2].author,
            likes: blogs[2].likes
        };

        expect(result).toEqual(correctBlog);
    });
});

describe("author with most writed blogs", () => {

    test("of empty list is null", () => {
        const result = listHelper.mostBlogs([]);
        expect(result).toEqual(null);
    });

    test("when list has only one item blogs writed is 1", () => {
        const result = listHelper.mostBlogs([].concat(blogs[1]));
        const correct = {
            author: blogs[1].author,
            blogs: 1
        };
        expect(result).toEqual(correct);
    });

    test("list with more than one blog returns correct author and blog count", () => {
        const result = listHelper.mostBlogs(blogs);
        const correct = {
            author: "Robert C. Martin",
            blogs: 3
        };

        expect(result).toEqual(correct);
    });
});

describe("author with most likes", () => {

    test("of empty list is null", () => {
        const result = listHelper.mostLikes([]);
        expect(result).toEqual(null);
    });

    test("when list has only one item likes equal that", () => {
        const result = listHelper.mostLikes([].concat(blogs[1]));
        const correct = {
            author: blogs[1].author,
            likes: blogs[1].likes
        };
        expect(result).toEqual(correct);
    });

    test("list with more than one blog returns correct author and likes count", () => {
        const result = listHelper.mostLikes(blogs);
        const correct = {
            author: "Edsger W. Dijkstra",
            likes: 17
        };

        expect(result).toEqual(correct);
    });
});