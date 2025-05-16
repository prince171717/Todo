import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt"; // ← Don’t forget this

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  passwordChangedAt: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// ✅ Automatically hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method (optional utility)

// UserSchema.methods.comparePassword = function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

// 🔐 Set passwordChangedAt before saving if password is modified

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// 🔑 Check if password was changed after JWT was issued

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTime;
  }
  return false;
};

// 🔄 Generate Reset Token

UserSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
