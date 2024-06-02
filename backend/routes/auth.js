const express = require('express');
const exValidator = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put('/signup', [
    exValidator
        .check('email')
        .isEmail()
        .trim()
        .withMessage('Enter valid email.')
        .custom((value) => {
            if (value === 'test@test.com') {
                return Promise.reject('This email is forbidden');
            }
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email already registered.');
                    }
                })
        }),
    exValidator
        .body('name')
        .isString()
        .isLength({ min: 5 })
        .trim(),
    exValidator
        .body('password', 'Please use at least 5 char long password')
        .isLength({ min: 5 })
        .trim()
        .isAlphanumeric(),
], authController.signup);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth,
    [
        exValidator
            .body('status')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.updateUserStatus
);

module.exports = router;