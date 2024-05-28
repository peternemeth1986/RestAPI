const express = require('express');
const exValidator = require('express-validator');

const feedController = require('../controllers/feed');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

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

router.put('/post/:postId', [
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
    feedController.updatePost);

router.delete('/post/:postId', feedController.deletePost);

module.exports = router;