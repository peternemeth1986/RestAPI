const User = require('../models/user');
const exValidator = require('express-validator');

exports.signup = (req, res, next) => {
    const errors = exValidator.validationResult(req);

    if (!errors) {
        const error = new Error('Validaiton failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
}