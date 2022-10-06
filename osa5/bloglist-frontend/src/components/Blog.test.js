import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";


describe("<Blog />", () => {
    
    
    const blog = {
        title: "First test",
        author: "testdev",
        url: "www.testing.fi",
        likes: 2
    };
    const loggedUser = {
        username: "abc",
        name: "abc",
        id: "12345546"
    };
    
    test("renders only blog title and blog author by default", () => {
    
        render(<Blog blog={blog}/>);
        const elementTitle = screen.getByText("First test", {exact: false});
        const elementAuthor = screen.getByText("testdev", {exact: false});
        const elementUrl = screen.queryByText("www.testing.fi", {exact: false});
        const elementLikes = screen.queryByText("2", {exact: false});
    
    
        expect(elementTitle).toBeDefined();
        expect(elementAuthor).toBeDefined();
        expect(elementUrl).toBeNull();
        expect(elementLikes).toBeNull();
    });
    
    test("clicking the viewButton shows title, author, url and likes", async () => {
    
        const mockUpdateBlog = jest.fn();
        const mockDeleteBlog = jest.fn();
        
        render(<Blog blog={blog}
            updateBlog={mockUpdateBlog}
            deleteBlog={mockDeleteBlog}
            loggedUser={loggedUser}/>);
    
        const user = userEvent.setup();
        const button = screen.getByText("view");
        await user.click(button);
    
        const elementTitle = screen.getByText("First test", {exact: false});
        const elementAuthor = screen.getByText("testdev", {exact: false});
        const elementUrl = screen.getByText("www.testing.fi", {exact: false});
        const elementLikes = screen.getByText("2", {exact: false});
    
        expect(elementTitle).toBeDefined();
        expect(elementAuthor).toBeDefined();
        expect(elementUrl).toBeDefined();
        expect(elementLikes).toBeDefined();
    
    
    });
    
    test("clicking the like button twice calls its eventHandler correct amount of times",
        async () => {
        
        const mockUpdateBlog = jest.fn();
        const mockDeleteBlog = jest.fn();
        
        render(<Blog blog={blog}
            updateBlog={mockUpdateBlog}
            deleteBlog={mockDeleteBlog}
            loggedUser={loggedUser}/>);
    
        const user = userEvent.setup();
        const button = screen.getByText("view");
        await user.click(button);
        const likeButton = screen.getByText("like");
        await user.click(likeButton);
        await user.click(likeButton);
    
        expect(mockUpdateBlog.mock.calls).toHaveLength(2);
    });
});