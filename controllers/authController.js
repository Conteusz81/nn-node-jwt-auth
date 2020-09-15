const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = err => {
    let errors = { email: '', password: '', login: ''};

    if (err.code === 11000) {
        errors.email = 'This email is already registered';
        return errors;
    }

    if (err.message === 'incorrect login') {
        errors.login = 'Login or Password is incorrect';
        return errors;
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            const { path, message } = properties;
            errors[path] = message;
        });
    }
    return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = id => {
  return jwt.sign({ id }, 'non public secret key', { expiresIn: maxAge });
};

const signup_get = (req, res) => res.render('signup');

const login_get = (req, res) => res.render('login');

const signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json( { user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors });
    }
};

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post
};
