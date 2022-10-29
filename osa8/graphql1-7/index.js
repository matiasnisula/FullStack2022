const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require("apollo-server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const JWT_SECRET = "ABCDEF";

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(username: String!, favoriteGenre: String!): User

    login(username: String!, password: String!): Token
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
    me: (root, args, context) => {
      return context.currentUser;
    },
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
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      let author = await Author.findOne({ name: args.author });
      try {
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
      } catch (error) {
        throw new UserInputError(
          "Author name must be at least 4 chars long. Book title must be at least 2 chars long",
          {
            invalidArgs: args,
          }
        );
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const authorToUpdate = await Author.findOne({ name: args.name });
      if (!authorToUpdate) {
        return null;
      }
      try {
        authorToUpdate.born = args.setBornTo;
        return authorToUpdate.save();
      } catch (error) {
        throw new UserInputError("param setBornTo must be number", {
          invalidArgs: args,
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });
      try {
        const savedUser = await user.save();
        return savedUser;
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "password") {
        throw new UserInputError("invalid username or password");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
