const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const mongoose = require('mongoose');

exports.getAllQuestions = async (req, res) => {
    try {
        const filter = {};
        if (req.query.quizId) {
            if (!mongoose.Types.ObjectId.isValid(req.query.quizId)) return res.status(400).json({ message: 'Invalid quizId' });
            filter.quizId = req.query.quizId;
        }
        const questions = await Question.find(filter).populate('quizId');
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createQuestions = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { text, options, keywords, correctAnswerIndex, quizId } = req.body;
        if (!text || !options || !Array.isArray(options) || options.length === 0 || typeof correctAnswerIndex !== 'number' || !quizId) {
            return res.status(400).json({ message: 'Missing or invalid fields: text, options (array), correctAnswerIndex (number), quizId' });
        }
        if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
            return res.status(400).json({ message: 'correctAnswerIndex is out of bounds for options array' });
        }
        if (!mongoose.Types.ObjectId.isValid(quizId)) return res.status(400).json({ message: 'Invalid quizId' });
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        const question = new Question({ text, options, keywords: keywords || [], correctAnswerIndex, quizId, author: req.user._id });
        const saved = await question.save();
        // keep quiz.questions in sync
        await Quiz.findByIdAndUpdate(quizId, { $push: { questions: saved._id } });
        res.status(201).json(saved);
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
        res.status(500).json({ message: error.message });
    }
}

// Create a question tied to the quizId param: POST /quizzes/:quizId/question
exports.createQuestionForQuiz = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const quizId = req.params.quizId;
        if (!mongoose.Types.ObjectId.isValid(quizId)) return res.status(400).json({ message: 'Invalid quizId' });
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        const { text, options, keywords, correctAnswerIndex } = req.body;
        if (!text || !options || !Array.isArray(options) || options.length === 0 || typeof correctAnswerIndex !== 'number') {
            return res.status(400).json({ message: 'Missing or invalid fields: text, options (array), correctAnswerIndex (number)' });
        }
        if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
            return res.status(400).json({ message: 'correctAnswerIndex is out of bounds for options array' });
        }

        const question = new Question({ text, options, keywords: keywords || [], correctAnswerIndex, quizId, author: req.user._id });
        const saved = await question.save();
        // keep quiz.questions in sync
        await Quiz.findByIdAndUpdate(quizId, { $push: { questions: saved._id } });
        res.status(201).json(saved);
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
        res.status(500).json({ message: error.message });
    }
}

// Create multiple questions tied to the quizId param: POST /quizzes/:quizId/questions
exports.createQuestionsForQuizBulk = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const quizId = req.params.quizId;
        if (!mongoose.Types.ObjectId.isValid(quizId)) return res.status(400).json({ message: 'Invalid quizId' });
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        // Accept either an array body or { questions: [...] }
        const payload = req.body;
        const arr = Array.isArray(payload) ? payload : payload && Array.isArray(payload.questions) ? payload.questions : null;
        if (!arr || arr.length === 0) return res.status(400).json({ message: 'Request body must be a non-empty array of questions or { questions: [...] }' });

        const docs = [];
        for (let i = 0; i < arr.length; i++) {
            const q = arr[i];
            if (!q || !q.text || !q.options || !Array.isArray(q.options) || q.options.length === 0 || typeof q.correctAnswerIndex !== 'number') {
                return res.status(400).json({ message: `Invalid question at index ${i}: required fields text, options (array), correctAnswerIndex (number)` });
            }
            if (q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length) {
                return res.status(400).json({ message: `correctAnswerIndex out of bounds at index ${i}` });
            }
            docs.push({ text: q.text, options: q.options, keywords: q.keywords || [], correctAnswerIndex: q.correctAnswerIndex, quizId, author: req.user._id });
        }

        // insertMany will perform faster for bulk inserts
        const inserted = await Question.insertMany(docs, { ordered: true });
        const ids = inserted.map(d => d._id);
        if (ids.length) await Quiz.findByIdAndUpdate(quizId, { $push: { questions: { $each: ids } } });
        res.status(201).json({ insertedCount: inserted.length, inserted });
    } catch (error) {
        // Bulk write errors may be thrown; return useful message
        if (error.name === 'ValidationError' || error.name === 'BulkWriteError') return res.status(400).json({ message: error.message });
        res.status(500).json({ message: error.message });
    }
}

exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(questionId)) return res.status(400).json({ message: 'Invalid ID' });
        const existing = await Question.findById(questionId);
        if (!existing) return res.status(404).json({ message: 'Question not found' });

        const updates = req.body;
        if (updates.quizId) {
            if (!mongoose.Types.ObjectId.isValid(updates.quizId)) return res.status(400).json({ message: 'Invalid quizId' });
            const quiz = await Quiz.findById(updates.quizId);
            if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
            // if quiz changed, move reference from old quiz to new quiz
            if (updates.quizId && existing.quizId && updates.quizId !== existing.quizId.toString()) {
                await Quiz.findByIdAndUpdate(existing.quizId, { $pull: { questions: existing._id } });
                await Quiz.findByIdAndUpdate(updates.quizId, { $push: { questions: existing._id } });
            }
        }
        const newOptions = updates.options || existing.options;
        const newCorrectIndex = (typeof updates.correctAnswerIndex === 'number') ? updates.correctAnswerIndex : existing.correctAnswerIndex;
        if (!Array.isArray(newOptions) || newOptions.length === 0) return res.status(400).json({ message: 'options must be a non-empty array' });
        if (newCorrectIndex < 0 || newCorrectIndex >= newOptions.length) return res.status(400).json({ message: 'correctAnswerIndex is out of bounds for options array' });

        const updated = await Question.findByIdAndUpdate(questionId, updates, { new: true, runValidators: true });
        res.status(200).json(updated);
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
        res.status(500).json({ message: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(questionId)) return res.status(400).json({ message: 'Invalid ID' });
        const deleted = await Question.findByIdAndDelete(questionId);
        if (!deleted) return res.status(404).json({ message: 'Question not found' });
        // remove from quiz.questions
        if (deleted.quizId) await Quiz.findByIdAndUpdate(deleted.quizId, { $pull: { questions: deleted._id } });
        res.status(200).json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const { questionId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(questionId)) return res.status(400).json({ message: 'Invalid ID' });
        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};