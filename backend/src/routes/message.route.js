import express from "express";

import { validateToken } from "../middleware/validateToken.middleware.js";

import { getUserforSidebar ,getMessages , sendMessage} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", validateToken, getUserforSidebar);

router.get("/:id", validateToken, getMessages);//check

router.post("/send/:id", validateToken, sendMessage); 


export default router;
