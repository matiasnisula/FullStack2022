import { useState } from "react";
import { deleteBlogById, addLikeToBlog } from "../reducers/blogReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";

const Blog = ({ id, author, title, url, likes, blogUserId, loggedUser }) => {
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  let buttonLabel = showAll ? "hide" : "view";

  const handleClickShowAll = () => {
    setShowAll(!showAll);
  };

  const handleClickLikes = () => {
    dispatch(addLikeToBlog(id));
  };

  const deleteBlog = (id) => {
    let confirmDelete = window.confirm(`Remove ${title} by ${author}`);
    if (!confirmDelete) {
      return;
    }
    dispatch(deleteBlogById(id))
      .then(() => {
        const message = `Deleted ${title} by ${author}`;
        dispatch(setNotificationWithTimeout(message, "notification", 5));
      })
      .catch((error) => {
        const errorMessage = `Failed to delete ${title} by ${author}`;
        console.log("ERROR: ", error);
        dispatch(setNotificationWithTimeout(errorMessage, "error", 5));
      });
  };

  const handleClickDelete = () => {
    deleteBlog(id);
  };

  if (showAll) {
    return (
      <div style={blogStyle} className="blog">
        <div>
          {title}
          <button onClick={handleClickShowAll}>{buttonLabel}</button>
        </div>
        <div>{author}</div>
        <div>{url}</div>
        <div>
          {likes}
          <button onClick={handleClickLikes}>like</button>
        </div>
        <div>
          {loggedUser.id === blogUserId ? (
            <button onClick={handleClickDelete}>delete</button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div style={blogStyle}>
      {title} {author}
      <button onClick={handleClickShowAll}>{buttonLabel}</button>
    </div>
  );
};

export default Blog;
