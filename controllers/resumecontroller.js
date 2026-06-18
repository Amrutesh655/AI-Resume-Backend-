const Resume = require("../models/Resume");
const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const {analyzeResume,} = require("../services/groqService");


const uploadResume = async (req, res) => {
  try {
    // Get uploaded file path
    const filePath = path.join(
      __dirname,
      "../uploads",
      req.file.filename
    );

    // Read PDF file
    const pdfBuffer = fs.readFileSync(filePath);

    // Extract text from PDF
    const data = await pdf(pdfBuffer);
    const text = data.text.toLowerCase();

     const aiFeedback =
     await analyzeResume(data.text);

     console.log("===== AI FEEDBACK =====");
     console.log(aiFeedback);
     console.log("=======================");
  

let score = 0;
let feedback = [];

const skills = [
  "html",
  "css",
  "javascript",
  "react",
  "node",
  "mongodb",
  "git",
  "github"
];

skills.forEach((skill) => {
  if (text.includes(skill)) {
    score += 10;
  } else {
    feedback.push(`Add ${skill} skill to resume`);
  }
});

    console.log("Extracted Text:");
    console.log(data.text);


    // Save resume data to MongoDB
  const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.filename,
      extractedText: data.text,
      score,
      feedback,
      aiFeedback,
 });

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Resume Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const matchJobDescription = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    const latestResume = await Resume.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!latestResume) {
      return res.status(404).json({
        message: "No resume found",
      });
    }

    const resumeText =
      latestResume.extractedText.toLowerCase();

    const jobText =
      jobDescription.toLowerCase();

    const skills = [
      "html",
      "css",
      "javascript",
      "react",
      "node",
      "mongodb",
      "git",
      "github",
      "aws",
      "docker",
      "typescript",
    ];

    let matchedSkills = [];
    let missingSkills = [];

    skills.forEach((skill) => {
      if (
        resumeText.includes(skill) &&
        jobText.includes(skill)
      ) {
        matchedSkills.push(skill);
      }

      if (
        !resumeText.includes(skill) &&
        jobText.includes(skill)
      ) {
        missingSkills.push(skill);
      }
    });

    const matchScore = Math.round(
      (matchedSkills.length /
        (matchedSkills.length +
          missingSkills.length || 1)) *
        100
    );

    res.status(200).json({
      success: true,
      matchScore,
      matchedSkills,
      missingSkills,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user._id,
    });

    const totalResumes = resumes.length;

    const highestScore =
      resumes.length > 0
        ? Math.max(
            ...resumes.map(
              (resume) => resume.score
            )
          )
        : 0;

    const latestResume =
      resumes.length > 0
        ? resumes[resumes.length - 1]
        : null;

    res.status(200).json({
      success: true,
      totalResumes,
      highestScore,
      latestScore:
        latestResume?.score || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(
      req.params.id
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(
      req.params.id
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await Resume.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


module.exports = {
  uploadResume,
  getMyResumes,
    matchJobDescription,
    getDashboardStats,
    getResumeById,
    deleteResume,
};