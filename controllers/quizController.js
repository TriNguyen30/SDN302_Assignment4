const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const mongoose = require("mongoose");

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().lean();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    // Ensure questions defaults to empty array if not provided
    const payload = Object.assign({}, req.body);
    if (!payload.questions) payload.questions = [];
    const quiz = new Quiz(payload);
    const saved = await quiz.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getQuizByID = async (req, res) => {
  try {
    const { quizId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) return res.status(400).json({ message: 'Invalid ID' });
    const quiz = await Quiz.findById(quizId).populate('questions').lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    return res.status(200).json(quiz);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) return res.status(400).json({ message: 'Invalid ID' });
    const updated = await Quiz.findByIdAndUpdate(quizId, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.populateQuestionsWithCapital = async (req, res) => {
  const keyword = "capital";
  const quiz = await Quiz.findById(req.params.quizId).populate({ path: 'questions', match: { keywords: keyword } });
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  res.status(200).json(quiz);
};


exports.deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) return res.status(400).json({ message: 'Invalid ID' });
    // delete the quiz and cascade delete its questions
    const deleted = await Quiz.findByIdAndDelete(quizId);
    if (!deleted) return res.status(404).json({ message: 'Quiz not found' });
    // remove questions that belonged to this quiz
    await Question.deleteMany({ quizId });
    res.status(200).json({ message: 'Quiz and its questions deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};