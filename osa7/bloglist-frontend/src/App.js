import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useMatch } from "react-router-dom";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateNewBlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import UserList from "./components/UserList";
import User from "./components/User";
import Blog from "./components/Blog";
import NavBar from "./components//NavBar";
import { initBlogs } from "./reducers/blogReducer";
import { initUsers } from "./reducers/userReducer";
import { initLoggedUserFromLocalStorage } from "./reducers/loggedUserReducer";

const App = () => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blogs);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initBlogs());
  }, []);

  useEffect(() => {
    dispatch(initUsers());
  }, []);

  useEffect(() => {
    dispatch(initLoggedUserFromLocalStorage());
  }, []);

  const blogFormRef = useRef();

  const matchUserId = useMatch("/users/:id");
  const matchBlogId = useMatch("/blogs/:id");

  /*eslint-disable */
  const user = matchUserId
    ? users.find((user) => {
        return user.id === matchUserId.params.id;
      })
    : null;

  const blog = matchBlogId
    ? blogs.find((blog) => {
        return blog.id === matchBlogId.params.id;
      })
    : null;
  /*eslint-enable */

  if (loggedUser === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <div>
        <NavBar loggedUserName={loggedUser.name} />
      </div>
      <div>
        <Notification />
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <CreateBlogForm blogFormRef={blogFormRef} />
              </Togglable>
              <BlogList />
            </>
          }
        />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<User user={user} />} />
        <Route
          path="/blogs/:id"
          element={<Blog blog={blog} showInfo={true} />}
        />
      </Routes>
    </div>
  );
};

export default App;
