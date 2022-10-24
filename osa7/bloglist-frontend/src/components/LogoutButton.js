import { logout } from "../reducers/loggedUserReducer";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
