const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
    const users = await User.find({});
    response.json(users);
});

usersRouter.post("/", async (request, response) => {
    const body = request.body;
    const userExists = await User.findOne({username: body.username});
    if (userExists) {
        return response.status(400).json({
            error: "username already exists"
        });
    }

    if (!body.username || !body.password) {
        return response.status(400).json({
            error: "password and username required"
        });
    }
    
    if (body.password.length < 3 || body.username.length < 3) {
        return response.status(400).json({
            error: "password and username must contain at least 3 characters"
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User ({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
});

module.exports = usersRouter;