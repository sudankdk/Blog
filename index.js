const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const userRoute = require("./Routes/user");
const mongoose = require("mongoose");
dotenv.config();
const app = express();
mongoose
  .connect("mongodb://localhost:27017/kahani")
  .then((e) => console.log("mongodb conncected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("home");
});

PORT = process.env.PORT || 8000;

app.use("/user", userRoute);
app.listen(PORT, () => console.log(`server is listening to port ${PORT}`));
