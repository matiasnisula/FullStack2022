import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateNewBlogForm";
import Button from "./components/Button";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState({
    title: "",
    author: "",
    url: ""
  });
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    type: ""
  });

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    );
  }, []);

  useEffect(() => {
    const loggedUser = window
      .localStorage
      .getItem("loggedUser");

    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
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

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = await blogService.create({...blog});

      setBlog({
        title: "",
        author: "",
        url: ""
      });
      setBlogs(blogs.concat(newBlog));
      console.log("added blog: ", newBlog);
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
      <CreateBlogForm blog={blog} setBlog={setBlog} handleSubmit={addBlog}/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  );
}

export default App;