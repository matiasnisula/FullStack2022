const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");


const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl)
    .then(() => {
        logger.info("connected to MongoDb");
    })
    .catch(error => {
        logger.error("error connecting to MongoDb: ", error.message);
    });


app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.errorHandler);

module.exports = app;