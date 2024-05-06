const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed')

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'https://cdpn.io');
    res.setHeader('Access-Control-Allow-Origin', '*'); // '*' allows every client access to the resource
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes);

app.listen(8080, () => {
    console.log('Server started.');
})

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
