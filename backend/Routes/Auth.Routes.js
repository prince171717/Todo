import { Router } from "express";
import { addTask, checkAuth, deleteAllTask, deleteTask, fetchTask, forgotPassword, login, logout, resetPassword, signup, updateTask } from "../Controllers/Auth.controller.js";
import {
  loginValidation,
  protectedRoute,
  signUpValidation,
} from "../Middlewares/Authvalidation.js";


const router = Router();

router.post("/signup", signUpValidation, signup);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.get("/checkauth",protectedRoute, checkAuth);
router.post("/addtask", protectedRoute,addTask);
router.get("/fetchtask", protectedRoute,fetchTask);
router.put("/updatetask/:id", protectedRoute,updateTask);
router.delete("/deletetask/:id", protectedRoute,deleteTask);
router.delete("/deleteall",protectedRoute,deleteAllTask)


router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;
