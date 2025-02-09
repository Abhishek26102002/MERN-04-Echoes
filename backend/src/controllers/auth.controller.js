import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.utils.js";
import cloudinary from "../config/cloudinary.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All feilds are Required",
    });
  }
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password Must be 6 char long" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
    });

    if (newUser) {
      await newUser.save();
      //generate jwt here
      generateToken(newUser._id, res);

      res.status(201).json({
        success: true,
        message: "user created Succesfully !",
        data: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          profilepic: newUser.profilepic,
        },
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User data" });
    }
  } catch (error) {
    console.log("Error in signup Controller :", error.message);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isHasPassCorrect = await bcrypt.compare(password, user.password);
    if (!isHasPassCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = generateToken(user._id, res);

    res.status(200).json({
      success: true,
      message: "user Logged in Succesfully !",
      data: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilepic: user.profilepic,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in Login Controller :", error.message);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logged out Successfully" });
  } catch (error) {
    console.log("Error in Logout Controller :", error.message);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const updateprofile = async (req, res) => {
  try {
    const { profilepic } = req.body;
    const userId = req.user._id; // this comming from token validate middleware

    if (!profilepic) {
      return res
        .status(400)
        .json({ success: false, message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilepic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "ProfilePic updated Succesfully !",
      data: updatedUser,
    });
  } catch (error) {
    console.log("Error in profileUpdate Controller :", error.message);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Authenticated",
      data: req.user,
    });
  } catch (error) {
    console.log("Error in checkAuth Controller :", error.message);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const deleteacc = async (req, res) => {
  const LoggedinUser = req.user._id;
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const AuthorizedUser = await User.findOne({ email });

  if (!AuthorizedUser) {
    return res.status(400).json({
      success: false,
      message: "user not exist Don't try to fool us around",
    });
  }

  if (AuthorizedUser._id.toString() !== LoggedinUser.toString()) {
    return res.status(400).json({
      success: false,
      message: "You are not Authorized to delete this user",
    });
  }
  try {
    const deletedUser = await User.findByIdAndDelete(AuthorizedUser._id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.log("Error in DeleteUser Controller :", error.message);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};
