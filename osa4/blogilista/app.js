const config = require("./utils/config");
const express = require("express");
const blogsRouter = require("./controllers//blogs");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");


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

module.exports = app;