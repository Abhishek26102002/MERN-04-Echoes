import React, { useRef, useState } from "react";
import { useChatStore } from "../ApiStore/useChatStore";
import { Image, SendHorizontal, X, SmilePlus } from "lucide-react";
import { toast } from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { useThemeStore } from "../ApiStore/useThemeStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { theme } = useThemeStore();

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="w-full p-1 pb-2">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className=" absolute bottom-24 sm:left-80">
          <EmojiPicker theme={theme} onEmojiClick={handleEmojiClick} />
          <button
            onClick={() => setShowEmojiPicker(false)}
            className="absolute -top-2 -right-2 shadow-lg rounded-full"
          >
            <X className="size-6" />
          </button>
        </div>
      )}

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <button
            type="button"
            className="flex justify-center items-center p-1 "
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <SmilePlus size={20} />
          </button>
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-md"
            placeholder="Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`flex justify-center items-center p-1
                     ${imagePreview ? "text-emerald-500" : "text-black-800"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className={`justify-center items-center p-1 ${
            !text.trim() && !imagePreview ? "text-gray-500" : ""
          }`}
          disabled={!text.trim() && !imagePreview}
        >
          <SendHorizontal size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
