const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { UserModel, CourseModel } = require("../../db/db.js");

async function verifyAdmin(req, res, next) {
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

    // If user is not admin
    const user = await UserModel.findOne({
      username: decodedData.username,
    });

    if (user.is_admin !== true) {
      return res.status(403).json({
        message: "User is not admin",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = verifyAdmin;
