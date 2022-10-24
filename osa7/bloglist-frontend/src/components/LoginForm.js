import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/loggedUserReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleInputUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleInputPassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    dispatch(login(username, password))
      .then(() => {
        setUsername("");
        setPassword("");
      })
      .catch((exception) => {
        const message = exception.response.data.error;
        dispatch(setNotificationWithTimeout(message, "error", 5));
      });
  };

  return (
    <form onSubmit={handleLogin} id="login-form">
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={handleInputUsername}
          id="username-input"
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={handleInputPassword}
          id="password-input"
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};
export default LoginForm;
