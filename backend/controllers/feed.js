const exValidator = require('express-validator');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const io = require('../socket');

exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find().skip((currentPage - 1) * perPage).populate('creator').limit(perPage);
        res.status(200).json({
            message: 'Fetched posts successfully',
            posts: posts,
            totalItems: totalItems
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.createPost = async (req, res, next) => {
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
    try {
        const imageUrl = req.file.path;
        const post = new Post({
            title: title,
            imageUrl: imageUrl.replace(/\\/g, "/"),
            content: content,
            creator: req.userId
        });
        await post.save();
        const user = await User.findById(req.userId);
        console.log(post);
        user.posts.push(post);
        await user.save();
        io.getIO().emit('posts', {
            action: 'create',
            post: {
                ...post._doc,
                creator: {
                    _id: req.userId,
                    name: user.name
                }
            }
        });
        res.status(201).json(({
            message: 'Post created successfully.',
            post: post,
            creator: {
                _id: user._id,
                name: user.name
            }
        }));
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error('Could not find the post');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Post fetched',
            post: post
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updatePost = async (req, res, next) => {
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
    try {
        const post = await Post.findById(postId).populate('creator');
        if (!post) {
            const error = new Error('Could not find the post');
            error.statusCode = 404;
            throw error;
        }
        if (post.creator._id.toString() !== req.userId) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
            console.log(`Image ${post.imageUrl} has been deleted`);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        const result = await post.save();
        io.getIO().emit('posts', {
            action: 'update',
            post: result
        });
        res.status(200).json({
            message: 'Post updated',
            post: post
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error('Could not find the post');
            error.statusCode = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        clearImage(post.imageUrl);
        await Post.findByIdAndDelete(postId);
        const user = await User.findById(req.userId);
        user.posts.pull(postId);
        const result = await user.save();
        io.getIO().emit('posts', {
            action: 'delete',
            post: postId
        });
        console.log('Post deleted: ', result);
        res.status(200).json({
            message: 'Post deleted.'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        if (err) {
            console.log(err);
        }
    })
}
