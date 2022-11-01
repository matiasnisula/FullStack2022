import { useEffect, useState } from "react";
import { useQuery, useLazyQuery, useApolloClient } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditAuthor from "./components/EditAuthor";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RecommendedBooks from "./components/RecommendedBooks";
import { ALL_AUTHORS, GET_LOGGED_USER } from "./queries";

const App = () => {
  const client = useApolloClient();
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const resultAuthors = useQuery(ALL_AUTHORS);
  const [getLoggedUser] = useLazyQuery(GET_LOGGED_USER, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      setToken(loggedUser);
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const result = await getLoggedUser();
      if (result.data.me) {
        setFavoriteGenre(result.data.me.favoriteGenre);
      }
    };
    getUser();
  }, [token]); //eslint-disable-line

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem("loggedUser");
    client.resetStore();
    setPage("authors");
  };

  return (
    <div>
      <NavBar
        setPage={setPage}
        loggedUser={token}
        setToken={setToken}
        logout={logout}
      />
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

      <RecommendedBooks
        show={page === "recommendations"}
        favoriteGenre={favoriteGenre}
      />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
