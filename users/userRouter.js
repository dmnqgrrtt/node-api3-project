const express = require('express');
const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
  .then(addedUser =>{
    res.status(201).json(addedUser);
  })
  .catch(error =>{
    res.status(500).json({message: "There was an error adding this user to the database"})
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const newPost = {...req.body, user_id: req.user.id};
  Posts.insert(newPost)
  .then(addedPost => {
    res.status(201).json(addedPost);
  })
  .catch(error =>{
    res.status(500).json({message: "There was an error adding this post to the database"})
  })
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
  .then(allUsers =>{
    res.status(200).json(allUsers)
  })
  .catch(error => {
    res.status(500).json({message: "There was an error retrieving the users"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
  .then(posts =>{ 
    res.status(200).json(posts);
  })
  .catch(error =>{
    res.status(500).json({message: "There was an error retrieving this user's posts"})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
  .then(deleted => {
    res.status(200).json(deleted);
  })
  .catch(error => {
    res.status(500).json({message: "There was an error deleting this user"})
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  Users.update(req.user.id, req.body)
  .then(updated =>{
    Users.getById(req.user.id)
    .then(user =>{
      res.status(200).json(user);
    })
    
  })
  .catch(error =>{
    res.status(500).json({message: "There was an error updating that user"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const {id} = req.params;
  Users.getById(id)
  .then(user =>{
    console.log("this is the user", user)
    if(user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
    
  })
  .catch(error =>{
    res.status(500).json({message: "There was an error retrieving that user"})
  })

}

function validateUser(req, res, next) {
  // do your magic!
  const newUser = req.body;
  if(Object.keys(newUser).length > 0) {
    if(newUser.name) {
      next();
    } else {
      res.status(400).json({ message: "missing required name field" });
    }
  } else {
    res.status(400).json({ message: "missing user data" });
  }
}

function validatePost(req, res, next) {
  // do your magic!
  const newPost = req.body;
  if(Object.keys(newPost).length > 0) {
    if(newPost.text) {
      next();
    } else {
      res.status(400).json({ message: "missing required text field" });
    }
  }else {
    res.status(400).json({ message: "missing post data" });
  }
}

module.exports = router;
