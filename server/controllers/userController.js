const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ROUNDS = parseInt(process.env.SALT_ROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;
const UserModel = require("../../db/userModel.js");
const CourseModel = require("../../db/courseModel.js");
const signupService = require("../services/signupService.js");
const loginService = require("../services/loginService.js");

async function userSignup(req, res) {
  try {
    await signupService(req.body.username, req.body.password, false);

    return res.send({
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

async function userLogin(req, res) {
  try {
    const token = await loginService(
      req.body.username,
      req.body.password,
      false
    );

    res.setHeader("Authorization", "Bearer " + token);

    return res.json({
      message: "User logged in",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

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

async function purchaseCourse(req, res) {
  try {
    const courseId = req.params.courseId;

    // Check if course exists and is published
    const course = await CourseModel.findById(courseId);
    if (!course || !course.published) {
      return res.status(400).json({
        message: "Course either does not exist or is not published",
      });
    }

    // If course already purchased
    const user = await UserModel.findById(req.userId);
    const ifCourseFound = user.purchasedCourses.find(
      (c) => c.toString() === courseId
    );
    if (ifCourseFound) {
      return res.status(403).json({
        message: "Course already purchased",
      });
    }

    // Purchase the course
    await UserModel.updateOne(
      { _id: req.userId },
      { $push: { purchasedCourses: courseId } }
    );

    return res.json({
      message: "Course purchased",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getPurchasedCourses(req, res) {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId).populate("purchasedCourses");

    return res.json({
      message: user.purchasedCourses,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  userSignup,
  userLogin,
  getCourses,
  purchaseCourse,
  getPurchasedCourses,
};
