import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
  },
  profilepic: {
    type: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilepic: {
      type: String,
      default: "",
    },
    contact: [contactSchema],
    requests: [contactSchema],
    activeStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
// Users is database name in MongoDB and mongodb encourage the name first letter to bne Uppercase
// Todo : add in Schema(Contacts, ActiveStatus, BlockList, ) || pages:Contact Add || Update profile , deactive profile , block Someone || Can Send Large Image ,remove profile pic . save hash message , delete from Sidebar(optional) , unread message show at top of chat,and as notification, add sound when chat Come.
