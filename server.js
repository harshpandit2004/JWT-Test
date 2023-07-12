require("dotenv").config()
const express = require("express");
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    id: 1,
    username: "John Doe",
    title: "Hello World",
    content: "This is my first post!",
  },
  {
    id: 2,
    username: "John Doe",
    title: "Hello World 2",
    content: "This is my second post!",
  },
];

app.get("/posts", (req, authenticateUser, res) => {
    res.send(posts.filter(post => post.username === req.user.name)); 
    console.log("Server Hit!")
});

app.post("/login", (req, res) => {
    // Authenticate User
    const username = req.body.username;
    const user = { name: username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); 
    res.json({ accessToken: accessToken }); 
});

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
