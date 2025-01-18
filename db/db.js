const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { ObjectId } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
});

const CourseSchema = new Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  imageLink: { type: String },
  published: { type: Boolean },
});

const UserModel = mongoose.model("user", UserSchema);
const CourseModel = mongoose.model("course", CourseSchema);

module.exports = { UserModel, CourseModel };
