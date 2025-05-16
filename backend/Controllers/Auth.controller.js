import UserModel from "../Models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Models/utils.js";
import jwt from "jsonwebtoken";
import addTaskModel from "../Models/addTask.js";
import sendEmail from "../Utils/sendEmail.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match ",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exist.Please returen to login page",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();
    console.log("signup successful");

    // generateToken(res, newUser);

    return res.status(201).json({
      success: true,
      message: "SignUp successful",
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    const errorMsg = "Authentication failed.Email or Password is wrong";
    if (!user) {
      return res.status(403).json({ success: false, message: errorMsg });
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) {
      return res.status(403).json({ success: false, message: errorMsg });
    }

    generateToken(res, user);
    res.status(200).json({
      success: true,
      message: "Login successful",
      email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
      expires: new Date(0),
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(404).json({ authenticated: false, token: null });
  }

  console.log("token", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded in checkauth", decoded);
    const user = await UserModel.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(404).json({ authenticated: false, user: null });
    }

    console.log("checkauth", user);

    res.status(200).json({ authenticated: true, user, token });
  } catch (error) {
    return res
      .status(401)
      .json({ authenticated: false, token: null, error: "Invalid token" });
  }
};

export const addTask = async (req, res) => {
  try {
    const { userTask } = req.body;
    const logginUserId = req.user.id;

    if (!userTask) {
      return res.status(401).json({ message: "Task is required" });
    }

    const newTask = new addTaskModel({ userId: logginUserId, task: userTask });

    await newTask.save();

    res.status(201).json({ success: true, message: "Task added successfully" });
  } catch (error) {
    console.log("Error in addTask controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const fetchUserTask = await addTaskModel
      .find({ userId })
      .sort({ createdAt: -1 });
    // console.log("fetchusertask", fetchUserTask);

    if (fetchUserTask.length === 0) {
      return res.status(404).json({ message: "NO task found", success: false });
    }

    res.status(200).json({ success: true, fetchUserTask });
  } catch (error) {
    console.log("Error in fetchusertask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { userTask, completed } = req.body;
    const updateUserTask = await addTaskModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    

    if (!updateUserTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (userTask !== undefined) {
      updateUserTask.task = userTask;
    }

    if (completed !== undefined) {
      updateUserTask.completed = completed;
    }

    await updateUserTask.save();
    res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.log("Error in updateTask controller", error.message);
    return res.status(500).json({ message: "Error in updating task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deleteUserTask = await addTaskModel.findById(req.params.id);
    if (!deleteUserTask) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }

    await addTaskModel.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.log("Error in deletetask controller", error.message);
    return res.status(500).json({ message: "Error in delete task" });
  }
};

export const deleteAllTask = async (req, res) => {
  try {
    await addTaskModel.deleteMany({ userId: req.user.id });
    res
      .status(200)
      .json({ success: true, message: "All tasks cleared successfully" });
  } catch (error) {
    console.log("Error in deleting all tasks controller:", error.message);
    res.status(500).json({ message: "Failed to clear all tasks" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = user.generateResetToken();
  await user.save({ validateBeforeSave: false }); // ✅ Important!

  console.log("Reset token sent in email:", resetToken);
  console.log("Hashed token saved to DB:", user.resetPasswordToken);

  // ✅ ✅ ✅ Adjust frontend URL if different
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `You requested a password reset.\n\nClick the link below:\n${resetURL}\n\nIf you didn’t request this, ignore this email.`;

  try {
    await sendEmail(user.email, "Reset Your Password", message);
    console.log("Sent token:", resetToken);
    console.log("Saved hash:", user.resetPasswordToken);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res
      .status(500)
      .json({ message: "Email could not be sent", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });
  console.log("Received token from URL:", req.params.token);
  console.log("Hashed token used to query:", resetToken);

  user.password = req.body.password; // Will be hashed by pre-save hook (if added)
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  res.status(200).json({ message: "Password updated successfully" });
};
