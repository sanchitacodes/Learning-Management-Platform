// import express from "express";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // To get __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const router = express.Router();

// // Load the association rules JSON once
// const rulesPath = path.join(__dirname, "../scripts/association_rules.json");
// const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

// // Endpoint: /api/recommendations/:courseId
// router.get("/recommendations/:courseId", (req, res) => {
//   const { courseId } = req.params;
//   const recommended = new Set();

//   rules.forEach((rule) => {
//     if (rule.antecedents.includes(courseId)) {
//       rule.consequents.forEach((item) => {
//         if (item !== courseId) {
//           recommended.add(item);
//         }
//       });
//     }
//   });

//   res.json({ courseId, recommendations: Array.from(recommended) });
// });

// export default router;



// import express from "express";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import {Course} from "../models/course.model.js"; // ✅ your Mongoose model

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const router = express.Router();

// const rulesPath = path.join(__dirname, "../scripts/association_rules.json");
// const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

// // GET /api/recommendations/:courseId
// router.get("/recommendations/:courseId", async (req, res) => {
//   const { courseId } = req.params;
//   const recommendedIds = new Set();

//   // Step 1: Get recommended course IDs
//   rules.forEach((rule) => {
//     if (rule.antecedents.includes(courseId)) {
//       rule.consequents.forEach((item) => {
//         if (item !== courseId) {
//           recommendedIds.add(item);
//         }
//       });
//     }
//   });

//   try {
//     // Step 2: Query MongoDB for full course details
//     const courses = await Course.find({
//       _id: { $in: Array.from(recommendedIds) },
//     }).select("-lectures"); // Optional: exclude heavy fields like lectures

//     res.json({ courseId, recommendations: courses });
//   } catch (error) {
//     console.error("Error fetching recommended courses:", error);
//     res.status(500).json({ error: "Failed to fetch recommended courses" });
//   }
// });

// export default router;


import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Course } from "../models/course.model.js"; // ✅ mongoose model

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const rulesPath = path.join(__dirname, "../scripts/association_rules.json");
const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

router.get("/recommendations/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    // Step 1: Get the course title by ID
    const selectedCourse = await Course.findById(courseId).select("courseTitle");

    if (!selectedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    const selectedTitle = selectedCourse.courseTitle;

    // Step 2: Find recommended titles
    const recommendedTitles = new Set();

    rules.forEach((rule) => {
      if (rule.antecedents.includes(selectedTitle)) {
        rule.consequents.forEach((title) => {
          if (title !== selectedTitle) {
            recommendedTitles.add(title);
          }
        });
      }
    });

    // Step 3: Query DB for those course titles
    const recommendedCourses = await Course.find({
      courseTitle: { $in: Array.from(recommendedTitles) },
    }).select("-lectures"); // Exclude heavy fields

    return res.json({ recommendations: recommendedCourses });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
