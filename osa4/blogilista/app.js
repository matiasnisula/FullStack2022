const config = require("./utils/config");
const express = require("express");
const morgan = require("morgan");
require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");

morgan.token("body", (req, res) => {
    return JSON.stringify(req.body);
});
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        tokens["response-time"](req, res), "ms",
        ((tokens.method(req, res) === "POST") ? tokens.body(req, res) : "")
    ].join(" ");
}));


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
app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
    const testingRouter = require("./controllers/testing");
    app.use("/api/testing", testingRouter);
}

app.use(middleware.errorHandler);

module.exports = app;