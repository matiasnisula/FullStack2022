import { useState } from "react";
import { useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditAuthor from "./components/EditAuthor";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const resultAuthors = useQuery(ALL_AUTHORS);
  const resultBooks = useQuery(ALL_BOOKS);

  console.log("result.data (authors): ", resultAuthors.data);
  console.log("result.data (books): ", resultBooks.data);

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors
        show={page === "authors"}
        authors={resultAuthors.loading ? [] : resultAuthors.data.allAuthors}
      />
      <EditAuthor
        show={page === "authors"}
        authors={resultAuthors.loading ? [] : resultAuthors.data.allAuthors}
      />

      <Books
        show={page === "books"}
        books={resultBooks.loading ? [] : resultBooks.data.allBooks}
      />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
