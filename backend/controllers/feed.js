const { post } = require("../routes/feed");
const exValidator = require('express-validator');

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

    res.status(201).json(({
        message: 'Post created successfully.',
        post: {
            _id: '3',
            title: title,
            content: content,
            creator: {
                name: 'Peti'
            },
            createdAt: new Date()
        }
    }));
}