const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const userRoute = require("./Routes/user");

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  res.render("home");
});

PORT = process.env.PORT || 8000;

app.use("/user", userRoute);
app.listen(PORT, () => console.log(`server is listening to port ${PORT}`));
