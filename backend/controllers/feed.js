const exValidator = require('express-validator');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                message: 'Fetched posts successfully',
                posts: posts
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const errors = exValidator.validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'Incorrect data added. Please check the correct length or format.'
        })
    }
    if (!req.file) {
        const error = new Error('No image uploaded.');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const post = new Post({
        title: title,
        imageUrl: imageUrl.replace(/\\/g, "/"),
        content: content,
        creator: {
            name: 'Peti'
        },
    });
    post
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(({
                message: 'Post created successfully.',
                post: result
            }));
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find the post');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Post fetched',
                post: post
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.updatePost = (req, res, next) => {
    const errors = exValidator.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'Incorrect data added. Please check the correct length or format.'
        });
    }
    const title = req.body.title;
    const content = req.body.content;
    const postId = req.params.postId;
    let imageUrl = req.body.image;

    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No image uploaded.');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find the post');
                error.statusCode = 404;
                throw error;
            }
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
                console.log(`Image ${post.imageUrl} has been deleted`);
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            return post.save();
        })
        .then(post => {
            res.status(200).json({
                message: 'Post updated',
                post: post
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find the post');
                error.statusCode = 404;
                throw error;
            }
            clearImage(post.imageUrl);
            return Post.findByIdAndDelete(postId);
        })
        .then(result => {
            console.log('Post deleted: ', result);
            res.status(200).json({
                message: 'Post deleted.'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        if (err) {
            console.log(err);
        }
    })
}
