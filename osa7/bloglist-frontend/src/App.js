import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useMatch } from "react-router-dom";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateNewBlogForm";
import LogoutButton from "./components/LogoutButton";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import UserList from "./components/UserList";
import User from "./components/User";
import { initBlogs } from "./reducers/blogReducer";
import { initLoggedUserFromLocalStorage } from "./reducers/loggedUserReducer";

const App = () => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const users = useSelector((state) => state.users);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initBlogs());
  }, []);

  useEffect(() => {
    dispatch(initLoggedUserFromLocalStorage());
  }, []);

  const blogFormRef = useRef();

  const match = useMatch("/users/:id");

  /*eslint-disable */
  const user = match
    ? users.find((user) => {
        return user.id === match.params.id;
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
        <Link style={{ padding: 5 }} to="/">
          blogs
        </Link>
        <Link style={{ padding: 5 }} to="/users">
          users
        </Link>
        <p>{loggedUser.name} logged in</p>
        <LogoutButton />
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
      </Routes>
    </div>
  );
};

export default App;
