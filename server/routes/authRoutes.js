import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

// login
// register
router.post("/register", registerUser);

// login
router.post("/login", loginUser)


export default router;
