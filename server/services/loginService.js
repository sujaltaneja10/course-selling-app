const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const UserModel = require("../../db/userModel.js");

async function login(username, password, isAdmin = false) {
  // If user does not exist
  const user = await UserModel.findOne({ username });
  if (!user) {
    throw new Error("User does not exist");
  }

  // If password is incorrect
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Incorrect credentials");
  }

  // Incorrect login endpoint
  if (user.is_admin !== isAdmin) {
    throw new Error("User is not admin");
  }

  // Return JWT
  const token = jwt.sign({ username, id: user._id }, JWT_SECRET);
  return token;
}

module.exports = login;
