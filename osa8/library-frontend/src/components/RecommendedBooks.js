import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ALL_BOOKS_BY_GENRE } from "../queries";

const RecommendedBooks = ({ show, favoriteGenre }) => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const result = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
  });

  useEffect(() => {
    if (result.data) {
      setRecommendedBooks(result.data.allBooks);
    }
  }, [result.data]); //eslint-disable-line

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favourite genre <strong>{favoriteGenre}</strong>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((book) => {
            return (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendedBooks;
