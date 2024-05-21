const express = require('express');
const exValidator = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
    exValidator
        .check('email')
        .isEmail()
        .normalizeEmail()
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

module.exports = router;