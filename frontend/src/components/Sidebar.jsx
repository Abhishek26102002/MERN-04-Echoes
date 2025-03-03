import React, { useState, useRef } from "react";
import { useChatStore } from "../ApiStore/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import {
  CircleUser,
  X,
  MessageSquareDiff,
  CirclePlus,
  UserPlus,
} from "lucide-react";
import { userStore } from "../ApiStore/userStore";
import { toast } from "react-hot-toast";
import { useMediaQuery } from "react-responsive";


const Sidebar = () => {
  const {
    users,
    getUsers,
    selectedUser,
    isUserLoading,
    setSelectedUser,
    addContact,
  } = useChatStore();

  const emailRef = useRef(null);

  const { onlineUsers } = userStore();
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });

  useState(() => {
    getUsers();
  }, [getUsers]);

  if (isUserLoading) return <SidebarSkeleton />;

  const handleAddContact = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    try {
      const email = emailRef.current.value.trim(); // Get input value
      if (!email) {
        toast.error("Please enter an email.");
        return;
      }

      await addContact(email);
      emailRef.current.value = ""; // Clear input after adding contact
      document.getElementById("my_modal_3").close();
    } catch (error) {
      toast.error("Error adding contact");
      console.error("Error adding contact:", error);
    }
  };

  return (
    <aside>
      <div className="h-full w-screen sm:w-72 sm:border-r border-base-300 flex flex-col transition-all duration-200 ">
        <div className="w-full p-4 sm:p-2 border-b border-base-300 flex flex-row place-content-between">
          <div className="items-center gap-2 flex">
            <CircleUser className="size-6" />
            <span className="font-medium block">Contacts</span>
          </div>
          {isLargeScreen ? (
            <button
              className="btn btn-sm"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              <UserPlus className="size-5" />
            </button>
          ) : (
            <button
              className="absolute bottom-16 right-10 sm:right-14 shadow-lg rounded-lg"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              <MessageSquareDiff className="text-accent shadow-lg" size={42} />
            </button>
          )}

          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  <X className="size-6" />
                </button>
              </form>
              <form
                onSubmit={handleAddContact}
                className="flex justify-center flex-row gap-2 sm:gap-3 "
              >
                <input
                  ref={emailRef}
                  type="text"
                  className="w-[70%] input input-bordered rounded-lg input-md"
                  placeholder="Enter Contact Email"
                />
                <button className="btn btn-circle" type="submit">
                  <UserPlus />
                </button>
              </form>
            </div>
          </dialog>
          {/* TODO : Online Filter Toggle*/}
        </div>

        <div className="overflow-y-auto w-full py-3">
          {users.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
            >
              <div className="">
                <img
                  src={user.profilepic || "/profile.png"}
                  alt={user.fullname}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="block text-left">
                <div className="font-medium truncate">{user.fullname}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
