import { useState } from "react";

const Blog = ({blog, updateBlog, deleteBlog, loggedUser}) => {
  const [showAll, setShowAll] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  let buttonLabel = showAll ? "hide" : "view";

  const handleClickShowAll = (e) => {
    setShowAll(!showAll);
  }

  const handleClickLikes = (e) => {
    const newLikes = blog.likes + 1;
    const user = blog.user;
    updateBlog({
      ...blog,
      likes: newLikes,
      user: user
    });
  }

  const handleClickDelete = (e) => {
    deleteBlog(blog);
  }

  if (showAll) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title}
          <button onClick={handleClickShowAll}>{buttonLabel}</button>
        </div>
        <div>
          {blog.author}
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          {blog.likes}
          <button onClick={handleClickLikes}>like</button>
        </div>
        <div>
          {loggedUser.id === blog.user
            ? <button onClick={handleClickDelete}>delete</button>
            :null}        
        </div>
      </div>
    );
  }
  
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={handleClickShowAll}>{buttonLabel}</button>
    </div>
  )  
}

export default Blog