const express = require("express");
const { Router } = require("express");
const {
  userSignup,
  userLogin,
  getCourses,
  purchaseCourse,
  getPurchasedCourses,
} = require("../controllers/userController.js");
const validateUserDetails = require("../middleware/validateUserDetails.js");
const verifyUser = require("../middleware/verifyUser.js");

const userRouter = Router();

userRouter.post("/signup", validateUserDetails, userSignup);
userRouter.post("/login", userLogin);
userRouter.get("/courses", verifyUser, getCourses);
userRouter.post("/courses/:courseId", verifyUser, purchaseCourse);
userRouter.get("/purchasedCourses", verifyUser, getPurchasedCourses);

module.exports = userRouter;
