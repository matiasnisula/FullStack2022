const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);
    if (error.name === "ValidationError"
        || error.name === "CastError") {

        return response.status(400).end();
    } else if (error.name === "JsonWebTokenError") {
        return response
            .status(401)
            .json({
                error: "invalid token"
            });
    }
    
    next(error);
};

const tokenExtractor = (request, response, next) => {
    const auth = request.get("authorization");

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        request.token = auth.substring(7);
    }
    next();
};

const userExtractor = async (request, response, next) => {
    const token = request.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token || !decodedToken.id) {
        return response
            .status(401)
            .json({
                error: "token missing or invalid"
            });
    }

    request.user = await User.findOne({_id: decodedToken.id});

    if (!request.user) {
        return response
            .status(400)
            .json({
                error: "User doesnt exists"
            });
    }

    next();
};

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
};