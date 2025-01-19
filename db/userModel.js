const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { ObjectId } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
  purchasedCourses: [
    {
      type: ObjectId,
      ref: "courses",
    },
  ],
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
