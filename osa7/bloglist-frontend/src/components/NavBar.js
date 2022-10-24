import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const NavBar = ({ loggedUserName }) => {
  return (
    <div>
      <Link style={{ padding: 5 }} to="/">
        blogs
      </Link>
      <Link style={{ padding: 5 }} to="/users">
        users
      </Link>
      {loggedUserName} logged in <LogoutButton />
    </div>
  );
};

export default NavBar;
