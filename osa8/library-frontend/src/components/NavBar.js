import { useApolloClient } from "@apollo/client";

const NavBar = ({ setPage, loggedUser, setToken }) => {
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem("loggedUser");
    client.resetStore();
    setPage("authors");
  };

  if (loggedUser) {
    return (
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommendations")}>
          recommendations
        </button>
        <button onClick={logout}>logout</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setPage("authors")}>authors</button>
      <button onClick={() => setPage("books")}>books</button>
      <button onClick={() => setPage("login")}>login</button>
    </div>
  );
};
export default NavBar;
