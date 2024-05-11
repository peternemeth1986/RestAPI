const exValidator = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts:
            [
                {
                    _id: '1',
                    title: "First post",
                    constent: "This is the first post",
                    imageUrl: 'images/78232ffe-a18a-405d-a9db-980fd186b0b2-_predator.jpg',
                    creator: {
                        name: 'Peti'
                    },
                    createdAt: new Date()
                },
                {
                    _id: '2',
                    title: "Second post",
                    constent: "This is the first post",
                    imageUrl: 'images/78232ffe-a18a-405d-a9db-980fd186b0b2-_predator.jpg',
                    creator: {
                        name: 'Peti'
                    },
                    createdAt: new Date()
                }
            ]
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

    const post = new Post({
        title: title,
        imageUrl: 'images/78232ffe-a18a-405d-a9db-980fd186b0b2-_predator.jpg',
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
        .catch(err => console.log(err));
}