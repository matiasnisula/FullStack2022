import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ALL_BOOKS_BY_GENRE, GET_LOGGED_USER } from "../queries";

const RecommendedBooks = ({ show }) => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [favoriteGenre, setFavoriteGenre] = useState("");

  const [getLoggedUser] = useLazyQuery(GET_LOGGED_USER);
  const [getBooksByGenre] = useLazyQuery(ALL_BOOKS_BY_GENRE);

  useEffect(() => {
    const getBooksByFavouriteGenre = async () => {
      const user = await getLoggedUser();
      const result = await getBooksByGenre({
        variables: { genre: user.data.me.favoriteGenre },
      });
      console.log("result: ", result);
      setRecommendedBooks(result.data.allBooks);
      setFavoriteGenre(user.data.me.favoriteGenre);
    };
    getBooksByFavouriteGenre();
  }, [favoriteGenre]); //eslint-disable-line

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
