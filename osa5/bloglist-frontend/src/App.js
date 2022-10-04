import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateNewBlogForm";
import Button from "./components/Button";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    type: ""
  });

  useEffect(() => {
    blogService
      .getAll()
      .then(resultBlogs => {
        setBlogs(resultBlogs.map(blog => {
          return ({
            id: blog.id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes,
            user: blog.user.id
          });  
        }));
    });
   
  }, []);

  useEffect(() => {
    const loggedUser = window
      .localStorage
      .getItem("loggedUser");

    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);


  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await 
        loginService.login({
          username,
          password
        });
      
      window.localStorage.setItem(
        "loggedUser", JSON.stringify(user)
      );
      
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");

    } catch (exception) {
        setNotification({
          message: exception.response.data.error,
          type: "error"
        });
        setTimeout(() => {
          setNotification({
            message: "",
            type: ""
          });
        }, 5000);
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      blogFormRef.current.toggleVisibility();

      setBlogs(blogs.concat(newBlog));
      setNotification({
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        type: "notification"
      });
      setTimeout(() => {
        setNotification({
          message: "",
          type: ""
        });
      }, 5000);
      
    } catch (exception) {
      const errorMessage = exception.response.data.error
        ? exception.response.data.error
        : "Cant add a new blog with given information. Please check the input fields."
      
      setNotification({
      message: errorMessage,
      type: "error"
      });
      setTimeout(() => {
        setNotification({
          message: "",
          type: ""
        });
      }, 5000);
    }
    
  }

  const updateBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject);
      console.log("updatedBlog: ", updatedBlog);
      setBlogs(blogs.map((blog) => {
        if (updatedBlog.id === blog.id) {
          return updatedBlog;
        }
        return blog;
      }));
      console.log("blogs: ", blogs);
    } catch (exception) {
      console.log("ERROR: ", exception);
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      let confirmDelete = window.confirm(`Remove ${blogObject.title} by ${blogObject.author}`);
      if (!confirmDelete) {
        return;
      }
      const result = await blogService.remove(blogObject.id);
      setBlogs(blogs.filter(blog => {
        return blog.id !== blogObject.id;
      }))

    } catch (exception) {
        console.log("ERROR: ", exception);
    }
  }
  
  const blogFormRef = useRef();

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />

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
      <Notification notification={notification} />
      <p>{user.name} logged in</p>
      <Button name="Logout" handleClick={handleLogout}/>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateBlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.sort((a, b) => {
        return b.likes - a.likes;
      })
      .map(blog =>
        <Blog key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          loggedUser={user}/>
      )}
    </div>
  );
}

export default App;