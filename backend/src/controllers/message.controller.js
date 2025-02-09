import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import { getReciverSocketId, io } from "../config/socket.js";

export const getAllUsers = async (req, res) => {
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
export const getUserforSidebar = async (req, res) => {
  try {
    const LoggedinUserId = req.user._id;

    const myContact = await User.find(LoggedinUserId).select("-_id contact");

    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      data: myContact,
    });
  } catch (error) {
    console.log(
      "Error in getuserforsidebar message.Controller :",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const addContact = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    // Find the user by email
    const contactUser = await User.findOne({ email }).select(
      "_id fullname email profilepic activeStatus"
    );

    if (!contactUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (loggedInUserId.toString() === contactUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself as a contact.",
      });
    }

    // Find the logged-in user
    const loggedInUser = await User.findById(loggedInUserId);

    if (
      loggedInUser.contact.some(
        (contact) => contact.email === contactUser.email
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "User is already in your contacts." });
    }

    // Add the contact as an object
    const newContact = {
      fullname: contactUser.fullname,
      email: contactUser.email,
      profilepic: contactUser.profilepic,
      _id: contactUser._id, // Store the user ID
      addedAt: new Date(),
    };

    loggedInUser.contact.push(newContact);
    await loggedInUser.save();

    res.status(200).json({
      success: true,
      message: "Contact added successfully.",
      data: newContact,
    });
  } catch (error) {
    console.error("Error adding contact:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
export const blockContact = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "No user provided." });
    }

    // Find the user by email
    const contactUser = await User.findOne({ email }).select(
      "_id fullname email profilepic activeStatus"
    );

    if (!contactUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Find the logged-in user
    const loggedInUser = await User.findById(loggedInUserId);

    // Check if the user is already blocked (i.e., not in the contact list)
    if (
      !loggedInUser.contact.some(
        (contact) => contact.email === contactUser.email
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "User is already blocked." });
    }

    // Remove from `contact` list (Filtering out the contact)
    const updatedContacts = loggedInUser.contact.filter(
      (contact) => contact.email !== contactUser.email
    );

    loggedInUser.contact = updatedContacts;

    await loggedInUser.save();

    return res.status(200).json({
      success: true,
      message: "Contact blocked successfully.",
      data: contactUser,
    });
  } catch (error) {
    console.error("Error blocking contact:", error);
    res.status(500).json({ success: false, message: "Server error." });
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

export const deleteMessages = async (req, res) => {
  try {
    const { senderId, reciverId } = req.body;

    // Validate input
    if (!senderId || !reciverId) {
      return res.status(400).json({
        success: false,
        message: "Both senderId and reciverId are required.",
      });
    }

    // Delete all messages where senderId and reciverId match (from both perspectives)
    const deletedMessages = await Message.deleteMany({
      $or: [
        { senderId, reciverId },
        { senderId: reciverId, reciverId: senderId }, // For two-way deletion
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Messages deleted from all successfully.",
      deletedCount: deletedMessages.deletedCount, // Number of deleted messages
    });
  } catch (error) {
    console.error("Error deleting messages:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
