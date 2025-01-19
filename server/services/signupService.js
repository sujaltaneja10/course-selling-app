const bcrypt = require("bcrypt");
require("dotenv").config();
const ROUNDS = parseInt(process.env.SALT_ROUNDS);
const UserModel = require("../../db/userModel.js");

async function signup(username, password, isAdmin = false) {
  // If user already exists
  const user = await UserModel.findOne({ username });

  console.log(user);

  if (user) {
    throw new Error("User already signed up");
  }

  // Hash password to store in database
  const hashedPassword = await bcrypt.hash(password, ROUNDS);

  await UserModel.create({
    username: username,
    password: hashedPassword,
    is_admin: isAdmin,
    purchasedCourses: [],
  });

  return;
}

module.exports = signup;
