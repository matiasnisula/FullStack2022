const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const initialUsers = require("./testData").users;

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});

    const userObjects = initialUsers
        .map(user => {
            return new User(user)
        });

    const promiseArray = userObjects.map(user => {
        return user.save();
    });
    await Promise.all(promiseArray);
});

describe("adding new user to db", () => {
    
    test("valid user can be added", async () => {
        const userToBeAdded = {
            username: "mn81",
            name: "Matias",
            password: "1234"
        };
        await api
            .post("/api/users")
            .send(userToBeAdded)
            .expect(201);

        const response = await api.get("/api/users");
        expect(response.body).toHaveLength(initialUsers.length + 1);

        const foundAddedUser = response.body.find(user => {
            return user.username === userToBeAdded.username
                && user.name === userToBeAdded.name
        });
        expect(foundAddedUser).toBeDefined();
    });

    test("username that already exists doesnt get added", async () => {
        let response = await api.get("/api/users");
        const usernameNotUnique = {
            username: response.body[0].username,
            name: "123",
            password: "abcde"
        };
        const result = await api
            .post("/api/users")
            .send(usernameNotUnique)
            .expect(400);
        
        expect(result.body.error).toBe("username already exists");
        
        response = await api.get("/api/users");
        expect(response.body).toHaveLength(initialUsers.length);

        const foundAddedUser = response.body.find(user => {
            return user.username === usernameNotUnique.username
                && user.name === usernameNotUnique.name
        });
        expect(foundAddedUser).not.toBeDefined();
    });

    test("user with username shorter than 3 doesnt get added", async () => {
        const invalidUserUsername = {
            username: "aa",
            name: "123",
            password: "abcde"
        };
        const result = await api
            .post("/api/users")
            .send(invalidUserUsername)
            .expect(400);
        
        expect(result.body.error).toBe("password and username must contain at least 3 characters");
        
        const response = await api.get("/api/users");
        expect(response.body).toHaveLength(initialUsers.length);

        const foundAddedUser = response.body.find(user => {
            return user.username === invalidUserUsername.username
                && user.name === invalidUserUsername.name
        });
        expect(foundAddedUser).not.toBeDefined();
    });

    test("user with password shorter than 3 doesnt get added", async () => {
        const invalidUserPassword = {
            username: "aaaa",
            name: "122",
            password: "ab"
        };
        const result = await api
            .post("/api/users")
            .send(invalidUserPassword)
            .expect(400);
        
        expect(result.body.error).toBe("password and username must contain at least 3 characters");
        
        const response = await api.get("/api/users");
        expect(response.body).toHaveLength(initialUsers.length);

        const foundAddedUser = response.body.find(user => {
            return user.username === invalidUserPassword.username
                && user.name === invalidUserPassword.name
        });
        expect(foundAddedUser).not.toBeDefined();
    });

    test("user with no username doesnt get added", async () => {
        const invalidUserNoUsername = {
            name: "123",
            password: "aasd"
        };
        const result = await api
            .post("/api/users")
            .send(invalidUserNoUsername)
            .expect(400);

        
        expect(result.body.error).toBe("password and username required");
        
        const response = await api.get("/api/users");
        expect(response.body).toHaveLength(initialUsers.length);

        const foundAddedUser = response.body.find(user => {
            return user.username === invalidUserNoUsername.username
                && user.name === invalidUserUsername.name
        });
        expect(foundAddedUser).not.toBeDefined();
    });

    test("user with no password doesnt get added", async () => {
        const invalidUserNoPassword = {
            username: "abcdef",
            name: "123"
        };

        const result = await api
            .post("/api/users")
            .send(invalidUserNoPassword)
            .expect(400);

        
        expect(result.body.error).toBe("password and username required");
        
        const response = await api.get("/api/users");
        expect(response.body).toHaveLength(initialUsers.length);

        const foundAddedUser = response.body.find(user => {
            return user.username === invalidUserNoPassword.username
                && user.name === invalidUserUsername.name
        });
        expect(foundAddedUser).not.toBeDefined();
    });
});

afterAll(() => {
    mongoose.connection.close();
});