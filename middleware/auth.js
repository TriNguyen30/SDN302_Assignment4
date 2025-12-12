const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// Validates the bearer token and attaches the user to the request
const verifyUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        const err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            const error = new Error('Failed to authenticate token!');
            error.status = 401;
            return next(error);
        }

        User.findById(decoded.userId)
            .then((user) => {
                if (!user) {
                    const notFound = new Error('User not found!');
                    notFound.status = 404;
                    return next(notFound);
                }
                req.user = user;
                return next();
            })
            .catch((dbErr) => next(dbErr));
    });
};

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        return next();
    }
    const err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
};

const verifyAuthor = async (req, res, next) => {
    const Question = require('../models/Question');
    const questionId = req.params.questionId;
    try {
        // Ensure user is authenticated (should be set by verifyUser middleware)
        if (!req.user) {
            const err = new Error('User not authenticated!');
            err.status = 401;
            return next(err);
        }
        
        const question = await Question.findById(questionId);
        if (!question) {
            const err = new Error('Question not found!');
            err.status = 404;
            return next(err);
        }
        
        // Compare the question's author ObjectId with the user's ObjectId
        if (question.author.toString() !== req.user._id.toString()) {
            const err = new Error('You are not the author of this question');
            err.status = 403;
            return next(err);
        }
        next();
    } catch (err) {
        return next(err);
    }
};


module.exports = {
    verifyUser,
    verifyAdmin,
    verifyAuthor,
};
