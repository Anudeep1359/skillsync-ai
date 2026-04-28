const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5050;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

const analysisSchema = new mongoose.Schema(
  {
    targetRole: String,
    userSkills: String,
    jobDescription: String,
    requiredSkills: [String],
    matchedSkills: [String],
    missingSkills: [String],
    matchPercentage: Number,
    roadmap: [
      {
        skill: String,
        steps: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

const skillDatabase = [
  "python",
  "java",
  "javascript",
  "typescript",
  "react",
  "node.js",
  "express",
  "mongodb",
  "sql",
  "postgresql",
  "mysql",
  "html",
  "css",
  "rest api",
  "machine learning",
  "data analysis",
  "data visualization",
  "tableau",
  "power bi",
  "aws",
  "azure",
  "docker",
  "git",
  "github",
  "agile",
  "scrum",
  "communication",
  "leadership",
  "problem solving",
  "project management",
];

const roadmapLibrary = {
  python: [
    "Review Python fundamentals and syntax",
    "Practice file handling, functions, and APIs",
    "Build a small automation, backend, or data project",
  ],
  java: [
    "Review Java syntax, classes, and object-oriented programming",
    "Practice collections, exception handling, and file handling",
    "Build a small Java application to strengthen fundamentals",
  ],
  javascript: [
    "Review ES6 syntax and modern JavaScript concepts",
    "Practice asynchronous programming with promises and fetch",
    "Build interactive browser-based components",
  ],
  react: [
    "Learn components, props, and state",
    "Practice React hooks such as useState and useEffect",
    "Build reusable dashboard components",
  ],
  "node.js": [
    "Learn the Node.js runtime environment",
    "Practice building APIs with Node.js",
    "Connect Node.js applications with databases",
  ],
  express: [
    "Learn Express routing and middleware",
    "Build REST API endpoints",
    "Connect Express routes with frontend requests",
  ],
  mongodb: [
    "Learn document-based database design",
    "Practice CRUD operations",
    "Connect MongoDB with an Express backend using Mongoose",
  ],
  "rest api": [
    "Understand HTTP methods such as GET, POST, PUT, and DELETE",
    "Practice creating RESTful endpoints",
    "Connect frontend forms to backend APIs",
  ],
  "machine learning": [
    "Study supervised learning basics",
    "Practice classification and regression examples",
    "Build a small prediction project",
  ],
  "data analysis": [
    "Practice cleaning and exploring datasets",
    "Use Python or SQL to summarize data",
    "Create a simple report or dashboard from a dataset",
  ],
  "data visualization": [
    "Learn chart types and when to use them",
    "Practice creating charts using visualization libraries",
    "Build a small dashboard with multiple visual summaries",
  ],
  aws: [
    "Learn cloud computing basics",
    "Practice deploying a small web application",
    "Understand storage, compute, and security services",
  ],
  docker: [
    "Learn container concepts and Docker commands",
    "Create a Dockerfile for a simple application",
    "Containerize a full-stack project",
  ],
  git: [
    "Practice commits, branches, and merges",
    "Use Git for tracking project progress",
    "Write clear commit messages",
  ],
  github: [
    "Create repositories and push project code",
    "Use README files to document applications",
    "Practice collaboration using branches and pull requests",
  ],
  agile: [
    "Understand Agile software development principles",
    "Practice breaking work into smaller tasks",
    "Use a simple Kanban board for project planning",
  ],
  communication: [
    "Practice explaining technical decisions",
    "Prepare short project summaries",
    "Present implementation choices clearly",
  ],
  "problem solving": [
    "Break large problems into smaller tasks",
    "Practice debugging and testing systematically",
    "Document solutions and lessons learned",
  ],
  "project management": [
    "Define project scope and milestones",
    "Track tasks, risks, and deadlines",
    "Prepare a final project summary and demo plan",
  ],
};

function extractRequiredSkills(jobDescription) {
  const text = jobDescription.toLowerCase();

  return skillDatabase.filter((skill) => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");
    return regex.test(text);
  });
}

function generateRoadmap(missingSkills) {
  return missingSkills.map((skill) => ({
    skill,
    steps:
      roadmapLibrary[skill] || [
        `Study the fundamentals of ${skill}`,
        `Complete a beginner project using ${skill}`,
        `Apply ${skill} in a portfolio project`,
      ],
  }));
}

app.get("/", (req, res) => {
  res.json({
    message: "SkillSync AI backend is running",
    status: "success",
  });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { targetRole, userSkills, jobDescription } = req.body;

    if (!userSkills || !jobDescription) {
      return res.status(400).json({
        error: "User skills and job description are required.",
      });
    }

    const userSkillList = userSkills
      .split(",")
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean);

    const requiredSkills = extractRequiredSkills(jobDescription);

    const matchedSkills = requiredSkills.filter((skill) =>
      userSkillList.includes(skill)
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !userSkillList.includes(skill)
    );

    const matchPercentage =
      requiredSkills.length === 0
        ? 0
        : Math.round((matchedSkills.length / requiredSkills.length) * 100);

    const roadmap = generateRoadmap(missingSkills);

    const analysis = await Analysis.create({
      targetRole,
      userSkills,
      jobDescription,
      requiredSkills,
      matchedSkills,
      missingSkills,
      matchPercentage,
      roadmap,
    });

    res.status(201).json(analysis);
  } catch (error) {
    console.error("Analyze error:", error.message);

    res.status(500).json({
      error: "Failed to analyze and save result.",
    });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const history = await Analysis.find().sort({ createdAt: -1 }).limit(10);

    res.json(history);
  } catch (error) {
    console.error("History error:", error.message);

    res.status(500).json({
      error: "Failed to fetch analysis history.",
    });
  }
});

app.delete("/api/history", async (req, res) => {
  try {
    await Analysis.deleteMany();

    res.json({
      message: "Analysis history cleared.",
    });
  } catch (error) {
    console.error("Clear history error:", error.message);

    res.status(500).json({
      error: "Failed to clear analysis history.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});