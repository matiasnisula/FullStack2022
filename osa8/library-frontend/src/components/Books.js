import { useQuery, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from "../queries";

const Books = ({ show }) => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");

  const resultBooks = useQuery(ALL_BOOKS);
  const [getBooksByGenre] = useLazyQuery(ALL_BOOKS_BY_GENRE);

  useEffect(() => {
    if (resultBooks.loading) {
      return;
    }
    let arrGenres = [];
    for (let book of resultBooks.data.allBooks) {
      for (let genre of book.genres) {
        if (!arrGenres.includes(genre)) {
          arrGenres.push(genre);
        }
      }
    }
    setBooks(resultBooks.data.allBooks.concat());
    setGenres(arrGenres.concat());
  }, [resultBooks.loading]); //eslint-disable-line

  if (!show) {
    return null;
  }

  const getBooks = async (genre) => {
    if (!genre) {
      setBooks(resultBooks.data.allBooks);
      setGenre("");
      return;
    }
    const result = await getBooksByGenre({ variables: { genre } });
    setBooks(result.data.allBooks);
    setGenre(genre);
  };

  return (
    <div>
      <h2>books</h2>
      <div>{genre ? `in genre ${genre}` : "all genres"}</div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => {
          return (
            <button key={genre} onClick={() => getBooks(genre)}>
              {genre}
            </button>
          );
        })}
        <button onClick={() => getBooks()}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
