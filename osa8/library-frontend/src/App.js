import { useEffect, useState } from "react";
import {
  useQuery,
  useLazyQuery,
  useApolloClient,
  useSubscription,
} from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditAuthor from "./components/EditAuthor";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RecommendedBooks from "./components/RecommendedBooks";
import {
  ALL_AUTHORS,
  GET_LOGGED_USER,
  BOOK_ADDED,
  ALL_BOOKS,
  ALL_BOOKS_BY_GENRE,
} from "./queries";

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

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      window.alert(
        `New book ${addedBook.title} by ${addedBook.author.name} has been added`
      );
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        if (!allBooks) {
          return;
        }
        return {
          allBooks: allBooks.concat(addedBook),
        };
      });
      client.cache.updateQuery(
        {
          query: ALL_BOOKS_BY_GENRE,
          variables: { genre: favoriteGenre },
        },
        (data) => {
          if (!data) {
            return;
          }
          return {
            allBooks: data.allBooks.concat(addedBook),
          };
        }
      );

      client.cache.updateQuery({ query: ALL_AUTHORS }, (data) => {
        if (!data) {
          return;
        }
        const authorFound = data.allAuthors.find((author) => {
          return author.name === addedBook.author.name;
        });
        const newBookCount = authorFound ? authorFound.bookCount + 1 : 1;
        const authorToAdd = { ...addedBook.author, bookCount: newBookCount };

        return {
          allAuthors: data.allAuthors.concat(authorToAdd),
        };
      });
    },
  });

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
