const { post } = require("../routes/feed");

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts:
            [
                { title: "First post", constent: "This is the first post" },
                { title: "Second post", constent: "This is the second post" }
            ]
    });
}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json(({
        message: 'Post created successfully.',
        post: {
            id: new Date().toISOString(),
            title: title,
            content: content
        }
    }));
}