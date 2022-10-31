import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditAuthor from "./components/EditAuthor";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RecommendedBooks from "./components/RecommendedBooks";
import { ALL_AUTHORS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const resultAuthors = useQuery(ALL_AUTHORS);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      setToken(loggedUser);
    }
  }, []);

  return (
    <div>
      <NavBar setPage={setPage} loggedUser={token} setToken={setToken} />
      <Authors
        show={page === "authors"}
        authors={resultAuthors.loading ? [] : resultAuthors.data.allAuthors}
      />
      <EditAuthor
        show={page === "authors"}
        authors={resultAuthors.loading ? [] : resultAuthors.data.allAuthors}
        token={token}
      />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <RecommendedBooks show={page === "recommendations"} />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
