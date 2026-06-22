const express = require("express");
const { body, validationResult } = require("express-validator");
const Quiz    = require("../models/Quiz");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── Mock question bank (replace with DB/OpenAI later) ────────────────────────
const QUESTION_BANK = {
  Mathematics: [
    { text: "What is the derivative of x²?", options: ["x", "2x", "2", "x²"], correct: 1, explanation: "By the power rule, d/dx(xⁿ) = nxⁿ⁻¹. So d/dx(x²) = 2x.", difficulty: "Medium", topic: "Calculus" },
    { text: "Solve for x: 2x + 5 = 13", options: ["3", "4", "5", "6"], correct: 1, explanation: "2x = 13 - 5 = 8, so x = 4.", difficulty: "Easy", topic: "Algebra" },
    { text: "What is the area of a circle with radius 7?", options: ["44π", "49π", "14π", "7π"], correct: 1, explanation: "Area = πr² = π × 7² = 49π.", difficulty: "Easy", topic: "Geometry" },
    { text: "Find the sum of the arithmetic series: 1 + 3 + 5 + ... + 99", options: ["2400", "2450", "2500", "2550"], correct: 2, explanation: "Number of terms = 50. Sum = n/2(first + last) = 50/2(1+99) = 2500.", difficulty: "Hard", topic: "Series" },
    { text: "What is log₁₀(1000)?", options: ["2", "3", "4", "10"], correct: 1, explanation: "log₁₀(1000) = log₁₀(10³) = 3.", difficulty: "Medium", topic: "Logarithms" },
  ],
  Physics: [
    { text: "A car accelerates from rest to 20 m/s in 5 seconds. What is the acceleration?", options: ["2 m/s²", "4 m/s²", "5 m/s²", "10 m/s²"], correct: 1, explanation: "a = Δv/Δt = (20-0)/5 = 4 m/s².", difficulty: "Medium", topic: "Mechanics" },
    { text: "What is the SI unit of force?", options: ["Joule", "Newton", "Pascal", "Watt"], correct: 1, explanation: "The Newton (N) is the SI unit of force. 1 N = 1 kg⋅m/s².", difficulty: "Easy", topic: "Units" },
    { text: "Which law states that every action has an equal and opposite reaction?", options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravitation"], correct: 2, explanation: "Newton's Third Law: For every action, there is an equal and opposite reaction.", difficulty: "Easy", topic: "Laws of Motion" },
    { text: "What is the speed of light in a vacuum?", options: ["3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "3 × 10¹² m/s"], correct: 1, explanation: "The speed of light c ≈ 3 × 10⁸ m/s in a vacuum.", difficulty: "Medium", topic: "Waves & Light" },
    { text: "A body of mass 5 kg is acted upon by a force of 20 N. What is the acceleration?", options: ["2 m/s²", "4 m/s²", "10 m/s²", "100 m/s²"], correct: 1, explanation: "F = ma → a = F/m = 20/5 = 4 m/s².", difficulty: "Medium", topic: "Mechanics" },
  ],
  Chemistry: [
    { text: "What is the atomic number of Carbon?", options: ["4", "6", "8", "12"], correct: 1, explanation: "Carbon has 6 protons, so its atomic number is 6.", difficulty: "Easy", topic: "Atomic Structure" },
    { text: "Which of the following is an alkali metal?", options: ["Calcium", "Magnesium", "Sodium", "Aluminium"], correct: 2, explanation: "Sodium (Na) is in Group 1 — the alkali metals.", difficulty: "Easy", topic: "Periodic Table" },
    { text: "What type of bond exists between H₂O molecules?", options: ["Ionic bond", "Covalent bond", "Hydrogen bond", "Metallic bond"], correct: 2, explanation: "Water molecules are held together by hydrogen bonds between the δ+ H and δ- O of adjacent molecules.", difficulty: "Medium", topic: "Chemical Bonding" },
    { text: "What is the pH of a neutral solution at 25°C?", options: ["0", "7", "10", "14"], correct: 1, explanation: "A neutral solution has equal concentrations of H⁺ and OH⁻, giving pH = 7.", difficulty: "Easy", topic: "Acids & Bases" },
    { text: "Alkanes belong to which series of hydrocarbons?", options: ["Unsaturated", "Saturated", "Aromatic", "Cyclic"], correct: 1, explanation: "Alkanes are saturated hydrocarbons — they contain only single C-C bonds.", difficulty: "Medium", topic: "Organic Chemistry" },
  ],
  Biology: [
    { text: "Which organelle is known as the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], correct: 2, explanation: "The mitochondria produces ATP through cellular respiration — hence 'powerhouse of the cell'.", difficulty: "Easy", topic: "Cell Biology" },
    { text: "What is the primary function of ribosomes?", options: ["Energy production", "Protein synthesis", "DNA replication", "Lipid storage"], correct: 1, explanation: "Ribosomes translate mRNA into proteins through a process called translation.", difficulty: "Easy", topic: "Cell Biology" },
    { text: "Which blood group is the universal donor?", options: ["A", "B", "AB", "O"], correct: 3, explanation: "Blood group O negative is the universal donor as it lacks A, B, and Rh antigens.", difficulty: "Medium", topic: "Human Physiology" },
    { text: "What process do plants use to make their own food?", options: ["Respiration", "Transpiration", "Photosynthesis", "Osmosis"], correct: 2, explanation: "Photosynthesis converts CO₂ and water into glucose using sunlight energy.", difficulty: "Easy", topic: "Plant Biology" },
    { text: "Which part of the brain controls balance and coordination?", options: ["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"], correct: 1, explanation: "The cerebellum is responsible for coordination, balance, and fine motor control.", difficulty: "Medium", topic: "Human Physiology" },
  ],
  English: [
    { text: "Which figure of speech is used in: 'The wind whispered through the trees'?", options: ["Simile", "Metaphor", "Personification", "Hyperbole"], correct: 2, explanation: "Personification attributes human characteristics (whispering) to non-human things (wind).", difficulty: "Medium", topic: "Figures of Speech" },
    { text: "Choose the correct spelling:", options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"], correct: 1, explanation: "The correct spelling is 'Accommodation' — double 'c' and double 'm'.", difficulty: "Easy", topic: "Spelling" },
    { text: "Which of these is a synonym for 'eloquent'?", options: ["Quiet", "Articulate", "Hesitant", "Confused"], correct: 1, explanation: "Eloquent means fluent and persuasive in speech — 'articulate' is the closest synonym.", difficulty: "Medium", topic: "Vocabulary" },
    { text: "Identify the correct sentence:", options: ["He don't know the answer.", "He doesn't knows the answer.", "He doesn't know the answer.", "He do not knows the answer."], correct: 2, explanation: "With third-person singular subjects, use 'doesn't' + base verb: 'He doesn't know'.", difficulty: "Easy", topic: "Grammar" },
    { text: "A passage that gives a brief account of someone's life is called a:", options: ["Obituary", "Biography", "Autobiography", "Profile"], correct: 1, explanation: "A biography is a written account of someone's life by another person.", difficulty: "Medium", topic: "Comprehension" },
  ],
};

const DEFAULT_QUESTIONS = [
  { text: "Which of the following is a primary colour of light?", options: ["Yellow", "Red", "Purple", "Orange"], correct: 1, explanation: "The primary colours of light are Red, Green, and Blue (RGB).", difficulty: "Easy", subject: "Physics", topic: "Optics" },
  { text: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2, explanation: "Gold's symbol Au comes from the Latin word 'Aurum'.", difficulty: "Easy", subject: "Chemistry", topic: "Periodic Table" },
  { text: "How many bones are in the adult human body?", options: ["196", "206", "216", "226"], correct: 1, explanation: "The adult human body has 206 bones.", difficulty: "Medium", subject: "Biology", topic: "Human Physiology" },
];

// ── Utility: shuffle array ────────────────────────────────────────────────────
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── POST /api/quiz/generate ───────────────────────────────────────────────────
router.post(
  "/generate",
  protect,
  [
    body("subject").notEmpty().withMessage("Subject is required"),
    body("count").optional().isInt({ min: 1, max: 20 }).withMessage("Count must be between 1 and 20"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { subject, topic, count = 5 } = req.body;

    try {
      // Get questions for the subject or fall back to defaults
      const bank = QUESTION_BANK[subject] || DEFAULT_QUESTIONS;
      const pool = topic ? bank.filter(q => q.topic === topic) : bank;
      const source = pool.length >= count ? pool : [...pool, ...DEFAULT_QUESTIONS];

      const selected = shuffle(source).slice(0, count).map(q => ({
        text:        q.text,
        options:     q.options,
        correct:     q.correct,
        explanation: q.explanation,
        subject:     q.subject || subject,
        topic:       q.topic || topic || "",
        difficulty:  q.difficulty || "Medium",
      }));

      const quiz = await Quiz.create({
        userId:    req.user._id,
        subject,
        topic:     topic || "",
        questions: selected,
      });

      // Return quiz WITHOUT correct answers (don't expose them to client)
      const sanitized = selected.map(({ text, options, subject, topic, difficulty }) => ({
        text, options, subject, topic, difficulty,
      }));

      res.status(201).json({
        success:   true,
        quizId:    quiz._id,
        subject:   quiz.subject,
        topic:     quiz.topic,
        questions: sanitized,
      });
    } catch (err) {
      console.error("Generate quiz error:", err.message);
      res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
  }
);

// ── POST /api/quiz/submit ─────────────────────────────────────────────────────
router.post(
  "/submit",
  protect,
  [
    body("quizId").notEmpty().withMessage("Quiz ID is required"),
    body("answers").isArray().withMessage("Answers must be an array"),
    body("timeTaken").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { quizId, answers, timeTaken = 0 } = req.body;

    try {
      const quiz = await Quiz.findOne({ _id: quizId, userId: req.user._id });
      if (!quiz) {
        return res.status(404).json({ success: false, message: "Quiz not found." });
      }
      if (quiz.completed) {
        return res.status(400).json({ success: false, message: "Quiz already submitted." });
      }

      // Grade answers
      let correct = 0, wrong = 0, skipped = 0;
      const gradedAnswers = quiz.questions.map((q, i) => {
        const selected  = answers[i] !== undefined ? answers[i] : null;
        const submitted = selected !== null;
        const isCorrect = submitted && selected === q.correct;

        if (!submitted) skipped++;
        else if (isCorrect) correct++;
        else wrong++;

        return { questionIndex: i, selected, isCorrect, submitted };
      });

      const score = Math.round((correct / quiz.questions.length) * 100);

      quiz.answers   = gradedAnswers;
      quiz.score     = score;
      quiz.correct   = correct;
      quiz.wrong     = wrong;
      quiz.skipped   = skipped;
      quiz.timeTaken = timeTaken;
      quiz.completed = true;
      await quiz.save();

      // Return full results WITH correct answers and explanations
      const detailed = quiz.questions.map((q, i) => ({
        text:        q.text,
        options:     q.options,
        correct:     q.correct,
        explanation: q.explanation,
        subject:     q.subject,
        topic:       q.topic,
        difficulty:  q.difficulty,
        userAnswer:  gradedAnswers[i].selected,
        isCorrect:   gradedAnswers[i].isCorrect,
        submitted:   gradedAnswers[i].submitted,
      }));

      res.status(200).json({
        success:   true,
        quizId:    quiz._id,
        score,
        correct,
        wrong,
        skipped,
        timeTaken,
        questions: detailed,
      });
    } catch (err) {
      console.error("Submit quiz error:", err.message);
      res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
  }
);

// ── GET /api/quiz/history ─────────────────────────────────────────────────────
router.get("/history", protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id, completed: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("subject topic score correct wrong skipped timeTaken createdAt questions");

    res.status(200).json({
      success: true,
      count:   quizzes.length,
      quizzes: quizzes.map(q => ({
        id:         q._id,
        subject:    q.subject,
        topic:      q.topic,
        score:      q.score,
        correct:    q.correct,
        wrong:      q.wrong,
        skipped:    q.skipped,
        timeTaken:  q.timeTaken,
        totalQ:     q.questions.length,
        date:       q.createdAt,
      })),
    });
  } catch (err) {
    console.error("Quiz history error:", err.message);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

module.exports = router;
