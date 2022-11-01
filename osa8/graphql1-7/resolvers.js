const { UserInputError, AuthenticationError } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");

const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const JWT_SECRET = "ABCDEF";

const pubsub = new PubSub();

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
        pubsub.publish("BOOK_ADDED", { bookAdded: savedBook });
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
  Subscription: {
    bookAdded: {
      subscribe: () => {
        return pubsub.asyncIterator("BOOK_ADDED");
      },
    },
  },
};

module.exports = resolvers;
