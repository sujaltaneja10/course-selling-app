const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const UserModel = require("../../db/userModel.js");
const CourseModel = require("../../db/courseModel.js");

async function verifyUser(req, res, next) {
  try {
    let token = req.headers.authorization;
    token = token.replace("Bearer ", "");

    const decodedData = jwt.verify(token, JWT_SECRET);

    // User not logged in
    if (!decodedData) {
      return res.status(401).json({
        message: "User not logged in",
      });
    }

    req.userId = decodedData.id;

    next();
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = verifyUser;
