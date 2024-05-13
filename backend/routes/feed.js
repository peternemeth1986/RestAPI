const express = require('express');
const exValidator = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', [
    exValidator.
        body('title')
        .isString()
        .isLength({ min: 5 })
        .trim(),
    exValidator
        .body('content')
        .isString()
        .isLength({ min: 5 })
        .trim(),
],
    feedController.createPost);

router.get('/post/:postId', feedController.getPost);

module.exports = router;