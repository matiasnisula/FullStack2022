import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";

const EditAuthor = ({ show, authors }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ALL_AUTHORS],
    onError: (error) => {
      console.log("error editing author: ", error);
    },
  });

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log("Person not found");
    }
  }, [result.data]);

  if (!show) {
    return null;
  }

  const editBirthyear = (event) => {
    event.preventDefault();
    editAuthor({
      variables: { name, born: Number(born) },
    });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={editBirthyear}>
        <select onChange={({ target }) => setName(target.value)}>
          {authors.map((author) => {
            return (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            );
          })}
        </select>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default EditAuthor;
