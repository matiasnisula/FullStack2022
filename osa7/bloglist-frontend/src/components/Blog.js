import {
  deleteBlogById,
  addLikeToBlog,
  addCommentToBlog,
} from "../reducers/blogReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Blog = ({ blog, showInfo }) => {
  if (!blog) {
    return null;
  }
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);
  const user = useSelector((state) => {
    return state.users.find((user) => {
      return user.id === blog.user;
    });
  });
  if (!user) {
    return null;
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleClickLikes = () => {
    dispatch(addLikeToBlog(blog.id));
  };

  const deleteBlog = (id) => {
    let confirmDelete = window.confirm(
      `Remove ${blog.title} by ${blog.author}`
    );
    if (!confirmDelete) {
      return;
    }
    dispatch(deleteBlogById(id))
      .then(() => {
        const message = `Deleted ${blog.title} by ${blog.author}`;
        dispatch(setNotificationWithTimeout(message, "notification", 5));
      })
      .catch((error) => {
        const errorMessage = `Failed to delete ${blog.title} by ${blog.author}`;
        console.log("ERROR: ", error);
        dispatch(setNotificationWithTimeout(errorMessage, "error", 5));
      });
  };

  const handleClickDelete = () => {
    deleteBlog(blog.id);
  };

  const addComment = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    dispatch(addCommentToBlog(blog.id, comment))
      .then(() => {
        event.target.comment.value = "";
      })
      .catch((error) => {
        dispatch(
          setNotificationWithTimeout("error adding comment", "error", 5)
        );
      });
  };

  if (!showInfo) {
    return (
      <div style={blogStyle}>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </div>
    );
  }

  return (
    <div style={blogStyle} className="blog">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          {blog.likes} likes
          <button onClick={handleClickLikes}>like</button>
        </div>
        <div>added by {user.name}</div>
      </div>
      <div>
        {loggedUser.id === blog.user ? (
          <button onClick={handleClickDelete}>delete</button>
        ) : null}
      </div>
      <div>
        <h3>comments</h3>
        <form onSubmit={addComment}>
          <input type="text" name="comment" id="comment" />
          <button type="submit">add comment</button>
        </form>
      </div>
      <div>
        <ul>
          {blog.comments.map((comment) => {
            return <li key={comment}>{comment}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Blog;
