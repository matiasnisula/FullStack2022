const LoginForm = (props) => {
  
  const handleInputUsername = (event) => {
    props.setUsername(event.target.value);
  }

  const handleInputPassword = (event) => {
    props.setPassword(event.target.value);
  }
  
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