const express = require('express');
const userRouter = require("./users/userRouter.js");
const postsRouter = require("./posts/postRouter");

const server = express();

server.use(express.json()); 
server.use(logger);

server.use('/api/users', userRouter);
server.use("/api/posts", postsRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`Method: ${req.method}, URL: ${req.url}, Timestamp:  ${Date.now()}`)
  next();
}

module.exports = server;
