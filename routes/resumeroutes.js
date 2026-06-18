const express = require("express");
const router = express.Router();

const protect = require("../middleware/authmiddleware");
const upload = require("../middleware/uploadmiddleware");

const {
  uploadResume,
    getMyResumes,
    matchJobDescription,
    getDashboardStats,
    getResumeById,
    deleteResume,
} = require("../controllers/resumeController");

router.post("/upload",protect,upload.single("resume"),uploadResume);

router.get("/my-resumes", protect, getMyResumes);
router.post("/match-job",protect,matchJobDescription);
router.get("/dashboard-stats", protect, getDashboardStats);
router.get("/:id", protect, getResumeById);
router.delete("/:id",protect,deleteResume);


module.exports = router;