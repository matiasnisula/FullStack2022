import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateNewBlogForm";
import LogoutButton from "./components/LogoutButton";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { initBlogs } from "./reducers/blogReducer";
import { initLoggedUserFromLocalStorage } from "./reducers/loggedUserReducer";

const App = () => {
  const loggedUser = useSelector((state) => state.loggedUser);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initBlogs());
  }, []);

  useEffect(() => {
    dispatch(initLoggedUserFromLocalStorage());
  }, []);

  const blogFormRef = useRef();

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
      <h2>Blogs</h2>
      <Notification />
      <p>{loggedUser.name} logged in</p>
      <LogoutButton />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateBlogForm blogFormRef={blogFormRef} />
      </Togglable>
      <BlogList />
    </div>
  );
};

export default App;
