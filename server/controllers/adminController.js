const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ROUNDS = parseInt(process.env.SALT_ROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;
const UserModel = require("../../db/userModel.js");
const CourseModel = require("../../db/courseModel.js");
const signupService = require("../services/signupService.js");
const loginService = require("../services/loginService.js");

// Creates a new admin account
async function adminSignup(req, res) {
  try {
    await signupService(req.body.username, req.body.password, true);

    return res.json({
      message: "Admin created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// Authenticates an admin
async function adminLogin(req, res) {
  try {
    const token = await loginService(
      req.body.username,
      req.body.password,
      true
    );

    res.setHeader("Authorization", "Bearer " + token);

    return res.json({
      message: "Admin logged in",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// Posts a new course
async function postCourse(req, res) {
  try {
    const course = await CourseModel.create(req.body);

    return res.json({
      message: "Course created successfully",
      courseId: course._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Edits a course given course id
async function editCourse(req, res) {
  try {
    await CourseModel.updateOne(
      {
        _id: req.params.courseId,
      },
      // {
      req.body
      // }
    );

    return res.json({
      message: "Course updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Get all courses
async function getCourses(req, res) {
  try {
    const courses = await CourseModel.find();
    return res.json(courses);
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  adminSignup,
  adminLogin,
  postCourse,
  editCourse,
  getCourses,
};
