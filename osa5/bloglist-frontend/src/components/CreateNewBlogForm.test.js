import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateNewBlogForm from "./CreateNewBlogForm";

describe("<CreateNewBlogForm />", () => {
    
    test("createBlog is called with correct params when submitting form", async () => {
        const user = userEvent.setup();
        const createBlogMock = jest.fn();

        const {container} = render(<CreateNewBlogForm createBlog={createBlogMock} />);
        
        const submitButton = screen.getByText("Create");

        const inputTitle = container.querySelector("#title-input");
        const inputAuthor = container.querySelector("#author-input");
        const inputUrl = container.querySelector("#url-input");

        await user.type(inputTitle, "Testing blog form");
        await user.type(inputAuthor, "TestUser");
        await user.type(inputUrl, "www.testuser.fi");
        await user.click(submitButton);

        expect(createBlogMock.mock.calls).toHaveLength(1);
        expect(createBlogMock.mock.calls[0][0].title).toBe("Testing blog form");
        expect(createBlogMock.mock.calls[0][0].author).toBe("TestUser");
        expect(createBlogMock.mock.calls[0][0].url).toBe("www.testuser.fi");        
    });
    
});