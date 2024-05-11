const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI_RESTAPI;
const feedRoutes = require('./routes/feed')

const app = express();
const PORT = 8080;
const hostname = "localhost";

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'https://cdpn.io');
    res.setHeader('Access-Control-Allow-Origin', '*'); // '*' allows every client access to the resource
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
        message: message
    })
})

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(8080, () => {
            console.log(`Server is running on ${hostname}:${PORT}`);
        });

    })
    .catch(err => {
        console.log(err);
    })

// CodePen - Ez arra van, hogy frontend nélkül egyszerűen tudjuk tesztelni a RestAPT-t
// HTML

// <button id="get">Get Posts</button>
// <button id="post">Create a Post</button>


// JS

// const getButton = document.getElementById('get');
// const postButton = document.getElementById('post');

// getButton.addEventListener('click', () => {
//   fetch('http://localhost:8080/feed/posts')
//     .then(res => res.json())
//     .then(resData => console.log(resData))
//     .catch(err => console.log(err));
// });

// postButton.addEventListener('click', () => {
//   fetch('http://localhost:8080/feed/post', {
//     method: 'POST',
//     body: JSON.stringify({
//       title: 'Third post',
//       content: 'This is the third post'
//     }),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(res => res.json())
//     .then(resData => console.log(resData))
//     .catch(err => console.log(err));
// });
