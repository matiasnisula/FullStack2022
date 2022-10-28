const { ApolloServer, gql } = require("apollo-server");
const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");

const MONGODB_URI =
  "mongodb+srv://fullstack:nisu1234@cluster0.ivlibtg.mongodb.net/graphqlApp?retryWrites=true&w=majority";

console.log("Connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        const result = await Book.find({}).populate("author");
        return result;
      } else if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author });
        const booksFoundWithGenreAndAuthor = await Book.find({
          author: author._id,
          genres: { $in: [args.genre] },
        }).populate("author");
        return booksFoundWithGenreAndAuthor;
      } else if (args.author) {
        const author = await Author.findOne({ name: args.author });
        const booksFoundWithAuthor = await Book.find({
          author: author._id,
        }).populate("author");
        return booksFoundWithAuthor;
      } else {
        const booksFoundWithGenre = await Book.find({
          genres: { $in: [args.genre] },
        }).populate("author");
        return booksFoundWithGenre;
      }
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root });
      return books.length;
    },
  },
  Book: {
    author: (root) => {
      return {
        name: root.author.name,
        born: root.author.born,
      };
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        const newAuthor = new Author({
          name: args.author,
          born: null,
        });
        author = await newAuthor.save();
      }
      const newBook = new Book({ ...args, author: author });
      const savedBook = await newBook.save();
      return savedBook;
    },
    editAuthor: async (root, args) => {
      const authorToUpdate = await Author.findOne({ name: args.name });
      if (!authorToUpdate) {
        return null;
      }
      authorToUpdate.born = args.setBornTo;
      return authorToUpdate.save();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
