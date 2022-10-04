import PropTypes from "prop-types";

const LoginForm = (props) => {

  LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired
  };

  const handleInputUsername = (event) => {
    props.setUsername(event.target.value);
  };

  const handleInputPassword = (event) => {
    props.setPassword(event.target.value);
  };

  return (
    <form onSubmit={props.handleLogin}>
      <div>
        username
        <input
          type="text"
          value={props.username}
          name="Username"
          onChange={handleInputUsername}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={props.password}
          name="Password"
          onChange={handleInputPassword}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};
export default LoginForm;