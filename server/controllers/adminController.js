const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ROUNDS = process.env.SALT_ROUNDS;
const JWT_SECRET = process.env.JWT_SECRET;
const { UserModel, CourseModel } = require("../../db/db.js");

// Creates a new admin account
async function adminSignup(req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    // If admin already exists
    const user = await UserModel.findOne({ username });
    console.log(user);

    if (user) {
      return res.status(400).send({
        message: "User already signed up",
      });
    }

    const hashedPassword = await bcrypt.hash(password, ROUNDS);
    console.log(hashedPassword);
    await UserModel.create({
      username: username,
      password: hashedPassword,
      is_admin: true,
    });

    return res.send({
      message: "Admin created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
    // console.log(err);
  }
}

// Authenticates an admin
async function adminLogin(req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    // If admin does not exist
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Admin does not exist",
      });
    }

    // If password is incorrect
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Incorrect credentials",
      });
    }

    // If user is not admin
    if (user.is_admin !== true) {
      return res.status(403).json({
        message: "User is not admin",
      });
    }

    // Return JWT
    const token = jwt.sign({ username }, JWT_SECRET);
    res.setHeader("Authorization", "Bearer " + token);
    return res.json({
      message: "Logged in successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
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
