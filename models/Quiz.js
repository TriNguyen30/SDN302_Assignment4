const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    questions: {
        type: [Schema.Types.ObjectId],
        ref: 'Question',
        required: true,
    }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;