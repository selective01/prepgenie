const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  text:        { type: String, required: true },
  options:     { type: [String], required: true },
  correct:     { type: Number, required: true },   // index of correct option
  explanation: { type: String, default: "" },
  subject:     { type: String, required: true },
  topic:       { type: String, default: "" },
  difficulty:  { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
});

const AnswerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  selected:      { type: Number, default: null },  // null = skipped
  isCorrect:     { type: Boolean, default: false },
  submitted:     { type: Boolean, default: false },
});

const QuizSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject:   { type: String, required: true },
    topic:     { type: String, default: "" },
    questions: { type: [QuestionSchema], required: true },
    answers:   { type: [AnswerSchema], default: [] },
    score:     { type: Number, default: null },       // percentage 0-100
    correct:   { type: Number, default: 0 },
    wrong:     { type: Number, default: 0 },
    skipped:   { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },           // seconds
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", QuizSchema);
