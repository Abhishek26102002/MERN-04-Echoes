import express from "express";

import { validateToken } from "../middleware/validateToken.middleware.js";

import {
  getAllUsers,
  addContact,
  getUserforSidebar,
  getMessages,
  sendMessage,
  blockContact,
  deleteMessages,
  removeRequest,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", validateToken, getUserforSidebar);

router.get("/allusers", validateToken, getAllUsers);

router.post("/addcontact", validateToken, addContact);

router.post("/toggleblock", validateToken, blockContact);

router.get("/:id", validateToken, getMessages); //check

router.post("/send/:id", validateToken, sendMessage);

router.delete("/deletemsg", validateToken, deleteMessages);

router.delete("/deletereq", validateToken, removeRequest);

export default router;
