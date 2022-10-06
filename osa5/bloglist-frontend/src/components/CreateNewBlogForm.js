import { useState } from "react";
import PropTypes from "prop-types";

const CreateNewBlogForm = (props) => {

  CreateNewBlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  };

  const [blog, setBlog] = useState({
    title: "",
    author: "",
    url: ""
  });

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setBlog({
      ...blog,
      [name]: value
    });
  };

  const addBlog = (event) => {
    event.preventDefault();
    props.createBlog({
      ...blog
    });

    setBlog({
      title: "",
      author: "",
      url: ""
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