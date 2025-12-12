var express = require('express');
var questionRouter = express.Router();
var auth = require('../middleware/auth');
const questionController = require('../controllers/questionController');
questionRouter
    .route('/')
    .get(questionController.getAllQuestions)
    .post(auth.verifyUser, questionController.createQuestions);
questionRouter
    .route('/:questionId')
    .put(auth.verifyUser, auth.verifyAuthor, questionController.updateQuestion)
    .delete(auth.verifyUser, auth.verifyAuthor, questionController.deleteQuestion)
    .get(questionController.getQuestionById);
module.exports = questionRouter;