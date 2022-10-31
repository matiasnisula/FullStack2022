import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditAuthor from "./components/EditAuthor";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const resultAuthors = useQuery(ALL_AUTHORS);
  const resultBooks = useQuery(ALL_BOOKS);

  console.log("result.data (authors): ", resultAuthors.data);
  console.log("result.data (books): ", resultBooks.data);

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

      <Books
        show={page === "books"}
        books={resultBooks.loading ? [] : resultBooks.data.allBooks}
      />

      <NewBook show={page === "add"} />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
