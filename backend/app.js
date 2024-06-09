const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const MONGODB_URI = process.env.MONGODB_URI_RESTAPI;
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 8080;
const hostname = "localhost";


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'https://cdpn.io');
    res.setHeader('Access-Control-Allow-Origin', '*'); // '*' allows every client access to the resource
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    })
})

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        const server = app.listen(8080, () => {
            console.log(`Server is running on ${hostname}:${PORT}`);
        });
        const io = require('socket.io')(server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        }
        );
        io.on('connection', socket => {
            console.log('Client connected');
        });

    })
    .catch(err => {
        console.log(err);
    })


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
