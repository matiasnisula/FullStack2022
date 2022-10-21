import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateNewBlogForm";
import Button from "./components/Button";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { setNotificationWithTimeout } from "./reducers/notificationReducer";
import { setBlogs } from "./reducers/blogReducer";

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getAll().then((resultBlogs) => {
      dispatch(
        setBlogs(
          resultBlogs.map((blog) => {
            return {
              id: blog.id,
              title: blog.title,
              author: blog.author,
              url: blog.url,
              likes: blog.likes,
              user: blog.user.id,
            };
          })
        )
      );
    });
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");

    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      const message = exception.response.data.error;
      dispatch(setNotificationWithTimeout(message, "error", 5));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const updateBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject);
      dispatch(
        setBlogs(
          blogs.map((blog) => {
            if (updatedBlog.id === blog.id) {
              return updatedBlog;
            }
            return blog;
          })
        )
      );
    } catch (exception) {
      console.log("ERROR: ", exception);
    }
  };

  const deleteBlog = async (blogObject) => {
    try {
      let confirmDelete = window.confirm(
        `Remove ${blogObject.title} by ${blogObject.author}`
      );
      if (!confirmDelete) {
        return;
      }
      await blogService.remove(blogObject.id);
      dispatch(
        setBlogs(
          blogs.filter((blog) => {
            return blog.id !== blogObject.id;
          })
        )
      );
    } catch (exception) {
      console.log("ERROR: ", exception);
    }
  };

  const blogFormRef = useRef();

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />

        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <p>{user.name} logged in</p>
      <Button name="Logout" handleClick={handleLogout} />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateBlogForm blogFormRef={blogFormRef} />
      </Togglable>
      <BlogList updateBlog={updateBlog} deleteBlog={deleteBlog} user={user} />
    </div>
  );
};

export default App;
