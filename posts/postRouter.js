const express = require('express');
const Posts = require("./postDb");

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  Posts.get()
  .then(allPosts =>{
    res.status(200).json(allPosts)
  })
  .catch(error => {
    res.status(500).json({message: "There was an error retrieving the post"})
  })
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.post.id)
  .then(deleted => {
    res.status(200).json(deleted);
  })
  .catch(error => {
    res.status(500).json({message: "There was an error deleting this post"})
  })
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.update(req.post.id, req.body)
  .then(updated =>{
    Posts.getById(req.post.id)
    .then(post =>{
      res.status(200).json(post);
    })
    
  })
  .catch(error =>{
    res.status(500).json({message: "There was an error updating that post"})
  })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const {id} = req.params;
  Posts.getById(id)
  .then(post =>{
    console.log("this is the post", post)
    if(post) {
      req.post = post;
      next();
    } else {
      res.status(400).json({ message: "invalid post id" });
    }
    
  })
  .catch(error =>{
    res.status(500).json({message: "There was an error retrieving that post"})
  })
}

module.exports = router;
