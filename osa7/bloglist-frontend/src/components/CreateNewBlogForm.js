import { useState } from "react";
import { useDispatch } from "react-redux";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";
import { createBlog } from "../reducers/blogReducer";

const CreateNewBlogForm = (props) => {
  const dispatch = useDispatch();

  const [blog, setBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setBlog({
      ...blog,
      [name]: value,
    });
  };

  const addBlog = (event) => {
    event.preventDefault();
    dispatch(createBlog({ ...blog }))
      .then(() => {
        const message = `a new blog ${blog.title} by ${blog.author} added`;
        setBlog({
          title: "",
          author: "",
          url: "",
        });
        dispatch(setNotificationWithTimeout(message, "notification", 5));
        props.blogFormRef.current.toggleVisibility();
      })
      .catch((error) => {
        const errorMessage =
          "Cant add a new blog with given information. Please check the input fields.";
        dispatch(setNotificationWithTimeout(errorMessage, "error", 5));
      });
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={blog.title}
          name="title"
          onChange={handleInputChange}
          id="title-input"
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={blog.author}
          name="author"
          onChange={handleInputChange}
          id="author-input"
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={blog.url}
          name="url"
          onChange={handleInputChange}
          id="url-input"
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateNewBlogForm;
