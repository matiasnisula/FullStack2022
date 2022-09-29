const logger = require("./logger");

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

module.exports = {
    errorHandler
}