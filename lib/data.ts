// ── SUBJECTS ──
export const subjects = [
  "Use of English",
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Agricultural Science",
  "Economics",
  "Government",
  "History",
  "Geography",
  "Commerce",
  "Accounting",
  "Literature in English",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Further Mathematics",
  "Arabic",
  "Technical Drawing",
  "Home Economics",
  "Food and Nutrition",
];

// ── FEATURES ──
export const features = [
  {
    title: "10,000+ Past Questions",
    desc: "Comprehensive question bank covering all JAMB subjects from 2000 to 2024 — fully categorized and searchable.",
    icon: "BookOpen",
  },
  {
    title: "AI-Powered Explanations",
    desc: "Every wrong answer comes with a clear, detailed AI explanation so you understand — not just memorize.",
    icon: "Sparkles",
  },
  {
    title: "Timed Mock Exams",
    desc: "Simulate the real JAMB experience with timed mock exams that match the official format exactly.",
    icon: "Timer",
  },
  {
    title: "Performance Analytics",
    desc: "Track your progress across subjects, identify weak areas, and see your improvement over time.",
    icon: "BarChart3",
  },
  {
    title: "Personalized Study Plan",
    desc: "AI analyzes your performance and recommends exactly what to study next for maximum score improvement.",
    icon: "Target",
  },
  {
    title: "Study on Any Device",
    desc: "Seamlessly switch between desktop, tablet, and mobile. Your progress syncs everywhere, always.",
    icon: "Smartphone",
  },
];

// ── PRICING ──
export const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    desc: "Get started with essential practice tools — no credit card required.",
    features: [
      "10 practice questions per day",
      "3 subjects only",
      "Basic performance stats",
      "Past questions (2020–2024)",
      "Community support",
    ],
    excluded: [
      "AI explanations",
      "Unlimited questions",
      "Mock JAMB exams",
      "Full analytics",
      "Study plans",
    ],
    cta: "Start for Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "₦2,500",
    period: "per month",
    desc: "Everything you need to maximize your JAMB score — unlimited and AI-powered.",
    features: [
      "Unlimited practice questions",
      "All 14 JAMB subjects",
      "AI-powered explanations",
      "Timed mock JAMB exams",
      "Full performance analytics",
      "Personalized study plans",
      "Progress reports via email",
      "Priority support",
    ],
    excluded: [],
    cta: "Start Pro",
    featured: true,
  },
  {
    name: "Annual",
    price: "₦8,000",
    period: "per year",
    desc: "Best value — save over 70% compared to monthly. Lock in your success.",
    features: [
      "Everything in Pro",
      "Save over ₦22,000 vs monthly",
      "Downloadable study materials",
      "Exam day tips and strategies",
      "WhatsApp study group access",
      "Certificate of completion",
    ],
    excluded: [],
    cta: "Get Annual Plan",
    featured: false,
  },
];

// ── TESTIMONIALS ──
export const testimonials = [
  {
    initials: "AO",
    name: "Adaeze Okonkwo",
    school: "Federal Government College, Enugu",
    score: "312",
    stars: 5,
    text: "I used PrepGenie for 3 months before my JAMB and scored 312. The AI explanations are what made the difference — I finally understood topics I had been struggling with for years.",
  },
  {
    initials: "TM",
    name: "Tunde Makinde",
    school: "Anambra State Secondary School",
    score: "298",
    stars: 5,
    text: "The mock exams felt exactly like the real JAMB. By the time I sat for the actual exam, I was so calm because I had already done it hundreds of times on PrepGenie.",
  },
  {
    initials: "FK",
    name: "Fatimah Kamal",
    school: "Queens College, Lagos",
    score: "305",
    stars: 5,
    text: "PrepGenie showed me exactly where I was weak. I spent 2 weeks focusing on just Chemistry and Government and my score jumped by 40 points. Best investment I ever made.",
  },
  {
    initials: "CE",
    name: "Chukwuemeka Eze",
    school: "Government College, Ibadan",
    score: "287",
    stars: 4,
    text: "The personalized study plan is brilliant. It told me exactly what topics to cover and in what order. I went from 220 in practice tests to 287 in my actual JAMB.",
  },
  {
    initials: "NI",
    name: "Ngozi Ikenna",
    school: "Loyola Jesuit College, Abuja",
    score: "320",
    stars: 5,
    text: "320 in JAMB! I could not believe it. PrepGenie Pro was worth every kobo. The unlimited questions and explanations helped me master every topic thoroughly.",
  },
  {
    initials: "BS",
    name: "Bayo Salami",
    school: "Lagos State Model College",
    score: "294",
    stars: 5,
    text: "I tried other platforms but PrepGenie is in a different class. The question quality, the explanations, the analytics — everything is just on another level.",
  },
];

// ── STATS ──
export const stats = [
  { value: "50,000+", label: "Students Enrolled"  },
  { value: "10,000+", label: "Practice Questions"  },
  { value: "89%",     label: "Score Improvement"   },
  { value: "4.9/5",   label: "Average Rating"      },
];

// ── FAQS ──
export const faqs = [
  { q: "Is PrepGenie free to use?",               a: "Yes. Our Free plan gives you 10 practice questions per day across 3 subjects with no credit card required. Upgrade to Pro for unlimited access." },
  { q: "How many subjects does PrepGenie cover?",  a: "PrepGenie covers all 14 JAMB subjects including English, Mathematics, Physics, Chemistry, Biology, Economics, Government, and more." },
  { q: "How do I pay for Pro?",                    a: "We accept card payments and bank transfers via Paystack. Subscribe monthly at 2,500 naira or annually at 8,000 naira for the best value." },
  { q: "Can I use PrepGenie on my phone?",         a: "Yes. PrepGenie is fully mobile-responsive and works on any device. Your progress syncs across all devices automatically." },
  { q: "Are the questions from real past JAMB?",   a: "Yes. Our question bank is sourced from actual JAMB past questions from 2000 to 2024, fully verified and categorized by topic and year." },
  { q: "What makes PrepGenie different?",          a: "The AI-powered explanations. Most platforms just show right or wrong — PrepGenie explains exactly why, helping you truly understand and not just memorize." },
  { q: "Can I cancel my subscription?",            a: "Yes, cancel anytime from your account settings. You keep access until the end of your billing period with no extra charges." },
  { q: "Is there a group or school plan?",         a: "We are working on school and group plans. Contact us at hello@prepgenie.ng if you are interested in bulk access for your school." },
];

// ── HOW IT WORKS ──
export const steps = [
  { num: "01", title: "Create Your Account",   desc: "Sign up for free in 30 seconds. No credit card required to get started with 10 daily practice questions."  },
  { num: "02", title: "Choose Your Subjects",  desc: "Select the subjects you are sitting for JAMB. PrepGenie personalizes your experience from day one."          },
  { num: "03", title: "Practice Daily",        desc: "Answer questions, review AI explanations, and track your progress with detailed performance analytics."       },
  { num: "04", title: "Ace Your JAMB",         desc: "Walk into your exam confident, prepared, and ready to score your highest ever."                              },
];
