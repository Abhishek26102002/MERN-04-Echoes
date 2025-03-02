import React, { useEffect, useState } from "react";
import { useChatStore } from "../ApiStore/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { userStore } from "../ApiStore/userStore";
import { formatMessageTime } from "../lib/utils";
import { useRef } from "react";
import { Sidebar } from "lucide-react";

const ChatContainer = () => {
  const {
    users,
    messages,
    getMessage,
    selectedUser,
    isMessageLoading,
    subscribeToMessages,
    unsubscribefromMessages,
  } = useChatStore();

  const { setuser } = userStore();
  const MessageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return; // Prevents unnecessary API calls

    getMessage(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribefromMessages();
  }, [
    getMessage,
    selectedUser?._id,
    subscribeToMessages,
    unsubscribefromMessages,
  ]);

  useEffect(() => {
    if (!MessageEndRef.current || !messages?.length) return;

    const timeout = setTimeout(() => {
      MessageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100); // Add a small delay

    return () => clearTimeout(timeout); // Cleanup function
  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === setuser._id ? "chat-end" : "chat-start"
            }`}
            ref={MessageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === setuser._id
                      ? setuser.profilepic || "/profile.png"
                      : selectedUser.profilepic || "/profile.png"
                  }
                  alt="Profile Pic"
                />
              </div>
            </div>
            <div className="chat-footer mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble bg-primary text-primary-content flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachmet"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}

              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
