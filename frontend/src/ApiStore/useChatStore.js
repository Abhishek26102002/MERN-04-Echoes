import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { create } from "zustand";
import { userStore } from "./userStore.js";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data.data });
    } catch (error) {
      console.log("Error in getusers useChatStore", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessage: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data.data });
    } catch (error) {
      console.log("Error in getMessage useChatStore", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (MessageData) => {
    const { messages, selectedUser } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        MessageData
      );
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      console.log("Error in sendMessage useChatStore", error);
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = userStore.getState().socket;

    // Remove previous listeners to prevent multiple subscriptions
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      console.log(newMessage);

      // Ensure the message belongs to the selected user before adding it
      if (newMessage.senderId !== selectedUser._id) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribefromMessages: () => {
    const socket = userStore.getState().socket;

    // Ensure we correctly unsubscribe from "newMessage"
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => {
    const { unsubscribefromMessages, subscribeToMessages } = get();

    // Unsubscribe from previous chat messages
    unsubscribefromMessages();

    // Set new selected user
    set({ selectedUser });

    // Subscribe to new chat messages
    subscribeToMessages();
  },
}));
