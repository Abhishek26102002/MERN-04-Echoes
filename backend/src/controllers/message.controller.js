import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import { getReciverSocketId, io } from "../config/socket.js";

export const getUserforSidebar = async (req, res) => {
  try {
    const LoggedinUserId = req.user._id;

    const filtereduser = await User.find({
      _id: { $ne: LoggedinUserId },
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      data: filtereduser,
    });
  } catch (error) {
    console.log(
      "Error in getuserforsidebar message.Controller :",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: frdId } = req.params;
    const myId = req.user._id;

    const msg = await Message.find({
      $or: [
        { senderId: myId, reciverId: frdId },
        { senderId: frdId, reciverId: myId },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Success fetching all message",
      data: msg,
    });
  } catch (error) {
    console.log("Error in getMessage message.Controller :", error.message);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    const senderId = req.user._id;
    const { id: reciverId } = req.params;

    let imageURL;
    if (image) {
      //upload base 64 encoded image to cloudinary
      const uploadedimage = await cloudinary.uploader.upload(image);
      imageURL = uploadedimage.secure_url;
    }

    const newMsg = new Message({
      senderId,
      reciverId,
      text,
      image: imageURL,
    });

    await newMsg.save();


    const reciverSocketId = getReciverSocketId(reciverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMsg);
    }

    res.status(200).json({
      success: true,
      message: "Sending message successful",
      data: newMsg,
    });
  } catch (error) {
    console.log("Error in send Message message.Controller :", error.message);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};
