const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { ObjectId } = require("mongoose");

const CourseSchema = new Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  imageLink: { type: String },
  published: { type: Boolean },
});

const CourseModel = mongoose.model("courses", CourseSchema);

module.exports = CourseModel;
