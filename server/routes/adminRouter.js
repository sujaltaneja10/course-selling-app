const express = require("express");
const { Router } = require("express");
const {
  adminSignup,
  adminLogin,
  postCourse,
  editCourse,
  getCourses,
} = require("../controllers/adminController.js");
const verifyAdmin = require("../middleware/verifyAdmin.js");
const validateUserDetails = require("../middleware/validateUserDetails.js");
const validateCourseDetails = require("../middleware/validateCourseDetails.js");

const adminRouter = Router();

adminRouter.post("/signup", validateUserDetails, adminSignup);
adminRouter.post("/login", adminLogin);
adminRouter.post("/courses", verifyAdmin, validateCourseDetails, postCourse);
adminRouter.put(
  "/courses/:courseId",
  verifyAdmin,
  validateCourseDetails,
  editCourse
);
adminRouter.get("/courses", verifyAdmin, getCourses);

module.exports = adminRouter;
