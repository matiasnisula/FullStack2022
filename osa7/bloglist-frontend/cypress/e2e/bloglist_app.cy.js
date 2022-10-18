describe("Blog app", function() {
    beforeEach(function () {
        cy.request("POST", "http://localhost:3003/api/testing/reset");
        const user = {
            name: "Matias",
            username: "nisu",
            password: "abc123"
        };
        cy.request("POST", "http://localhost:3003/api/users", user);
        cy.visit("http://localhost:3000");
    });
    
    it("Login form is shown", function () {
        cy.contains("Log in to application");
        cy.get("#login-form").should("be.visible");
    });

    describe("Login", function () {
        it("succeeds with correct credentials", function () {
            cy.get("#username-input").type("nisu");
            cy.get("#password-input").type("abc123");
            cy.contains("login").click();

            cy.contains("Blogs");
            cy.contains("Logout");
            cy.contains("new blog");
        });

        it("fails with wrong credentials", function () {
            cy.get("#username-input").type("wrongusername");
            cy.get("#password-input").type("wrongpassword");
            cy.contains("login").click();

            cy.get(".error")
                .should("contain", "invalid username or password")
                .and("have.css", "color", "rgb(255, 0, 0)");
        });
    });

    describe("When logged in", function () {
        beforeEach(function () {
            cy.request("POST",
                "http://localhost:3003/api/login",
                {
                    username: "nisu",
                    password: "abc123"
                })
                .then(response => {
                    localStorage.setItem("loggedUser", JSON.stringify(response.body));
                    cy.visit("http://localhost:3000");
                });
        })

        it("A blog can be created", function () {
            cy.contains("new blog").click();

            cy.get("#title-input").type("E2E blog");
            cy.get("#author-input").type("TestUser");
            cy.get("#url-input").type("www.E2E.fi");

            cy.contains("Create").click();

            cy.contains("E2E blog");
            cy.contains("TestUser");

            cy.get(".notification")
                .should("contain", "a new blog E2E blog by TestUser added")
                .and("have.css", "color", "rgb(0, 128, 0)")
        });

        describe("and several blogs exists", function () {
            beforeEach(function () {
                cy.createBlog({
                    title: "Test blog one cypress",
                    author: "First test author",
                    url: "www.testblogone.fi"
                });
                cy.createBlog({
                    title: "Test blog two cypress",
                    author: "Second test author",
                    url: "www.testblogtwo.fi"
                });
                cy.createBlog({
                    title: "Test blog three cypress",
                    author: "Third test author",
                    url: "www.testblogthree.fi"
                });
            });

            it("they can be liked", function () {
                cy.contains("Test blog one cypress")
                    .contains("view")
                    .click();
                
                cy.contains("like").click();
                cy.contains("1");
                cy.contains("like").click();
                cy.contains("2");

                cy.contains("hide").click();
                
                cy.contains("Test blog two cypress")
                    .contains("view")
                    .click();
                
                cy.contains("like").click();
                cy.contains("1");
                cy.contains("like").click();
                cy.contains("2");

            });

            it("a blog can be deleted by adder of the blog", function () {
                cy.contains("Test blog one cypress")
                    .contains("view")
                    .click();
                
                cy.contains("delete").click();
                cy.wait(300);
                cy.contains("Test blog two cypress");
                cy.should("not.contain", "Test blog one cypress");
            });

            it("they are sorted descending by likes", function () {
                cy.contains("Test blog one cypress")
                    .contains("view")
                    .click();
                
                cy.contains("Test blog two cypress")
                    .contains("view")
                    .click();
                
                cy.contains("Test blog three cypress")
                    .contains("view")
                    .click();

                cy.contains("Test blog one cypress")
                    .parent()
                    .contains("like")
                    .as("likeBtnOne");
                
                cy.contains("Test blog two cypress")
                    .parent()
                    .contains("like")
                    .as("likeBtnTwo");
                
                cy.contains("Test blog three cypress")
                    .parent()
                    .contains("like")
                    .as("likeBtnThree");

                cy.get("@likeBtnOne").click();
                cy.wait(100);

                cy.get("@likeBtnTwo").click();
                cy.wait(100);
                cy.get("@likeBtnTwo").click();
                cy.wait(100);

                cy.get("@likeBtnThree").click();
                cy.wait(100);
                cy.get("@likeBtnThree").click();
                cy.wait(100);
                cy.get("@likeBtnThree").click();
                cy.wait(100);

                cy.get(".blog").eq(0).should("contain", "Test blog three cypress");
                cy.get(".blog").eq(1).should("contain", "Test blog two cypress");
                cy.get(".blog").eq(2).should("contain", "Test blog one cypress");
            });
        });

    });
});