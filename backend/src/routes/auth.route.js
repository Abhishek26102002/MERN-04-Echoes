import express from "express";
import {
  login,
  logout,
  signup,
  updateprofile,
  checkAuth
} from "../controllers/auth.controller.js";
import { validateToken } from "../middleware/validateToken.middleware.js";


const router = express.Router();

router.post("/login", login);

router.post("/logout", logout);

router.post("/signup", signup);

router.put("/update-profile", validateToken, updateprofile);

router.get("/check", validateToken, checkAuth);

export default router;
