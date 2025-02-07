import React, { useState } from "react";
import { useChatStore } from "../ApiStore/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { CircleUser } from "lucide-react";
import { userStore } from "../ApiStore/userStore";

const Sidebar = () => {
  const { users, getUsers, selectedUser, isUserLoading, setSelectedUser } =
    useChatStore();

  const { onlineUsers } = userStore();

  useState(() => {
    getUsers();
  }, [getUsers]);

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside>
      <div className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="w-full p-5 border-b border-base-300">
          <div className="flex items-center gap-2">
            <CircleUser className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
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
              <div className="relative mx-auto lg:mx-0">
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
              <div className="hidden lg:block text-left min-w-0">
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
