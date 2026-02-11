import { Router } from "express";

import { signup ,login } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Signup route
router.post("/signup",  signup);

// Login route
router.post("/login", login);

export default router;