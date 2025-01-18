const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const path = require("path");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandler.js");
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL);

const adminRouter = require("./routes/adminRouter.js");
const userRouter = require("./routes/userRouter.js");

app.use(express.json());
// app.get("/", (req, res) => {
//   return res.send({
//     message: "S",
//   });
// });
app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port: ` + PORT);
});
