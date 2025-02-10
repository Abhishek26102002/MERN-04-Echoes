import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { create } from "zustand";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore.js";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const userStore = create((set, get) => ({
  setuser: null,
  isSignup: false,
  isLogin: false,
  isUpdateProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ setuser: res.data.data });
      get().connectSocket(); //Socket Connect
    } catch (error) {
      console.log("Error in Check Auth userStore", error);
      // toast.error(error.response.data.message);
      set({ setuser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSignup: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ setuser: res.data.data });
      toast.success(res.data.message);
      get().connectSocket(); //Socket Connect
    } catch (error) {
      console.log("Error in Signup userStore", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSignup: false });
    }
  },
  login: async (data) => {
    set({ isLogin: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ setuser: res.data.data });
      toast.success(res.data.message);
      get().connectSocket(); //Socket Connect
    } catch (error) {
      console.log("Error in Login userStore", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLogin: false });
    }
  },

  googleAuth: async (code) => {
    set({ isLogin: true });
    try {
      const res = await axiosInstance.post("/auth/google", { code });
      console.log(res);
      set({ setuser: res.data.data });
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      console.log("Error in GoogleAuth userStore", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLogin: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ setuser: null });
      toast.success(res.data.message);
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout userStore", error);
      toast.error(error.response.data.message);
    }
  },

  updateprofile: async (data) => {
    set({ isUpdateProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ setuser: res.data.data });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error in updateProfile userStore", error);
      toast.error("Too Large image");
    } finally {
      set({ isUpdateProfile: false });
    }
  },
  deleteuser: async (email) => {
    try {
      const res = await axiosInstance.delete("/auth/delete", {
        data: { email },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        window.location.reload(true);
      }
    } catch (error) {
      console.log("Error in deleteuser userStore", error);
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { setuser } = get();
    // if the user is not logged in /not Authenticated or already connected so dont make connection
    if (!setuser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: setuser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    // now get the method from backend and let everyone know that the user is Connected
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
