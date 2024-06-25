const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/public/imges/avatar.png",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");

  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashPassword;

  next();
});

userSchema.static("matchPassword", async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) return false;

    const salt = user.salt;
    const hashPassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    return hashPassword === userProvidedHash ? user : false;
  } catch (error) {
    console.error("Error matching password:", error);
    return false;
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
