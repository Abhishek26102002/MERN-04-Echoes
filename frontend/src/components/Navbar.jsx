import React, { useState } from "react";
import { userStore } from "../ApiStore/userStore";
import { useChatStore } from "../ApiStore/useChatStore";
import { Link } from "react-router-dom";
import { LogOut, CircleUser, Settings2, Users } from "lucide-react";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { setuser, logout } = userStore();
  const { addContact, deleteRequest } = useChatStore();

  
  const handleAccept = async (email) => {
    try {
      if (!email) {
        toast.error("No email found.");
        return;
      }
      await addContact(email);
      await deleteRequest(email);
      toast.success("Request Accepted");
    } catch (error) {
      toast.error("Error handleAccept Navbar");
      console.error("Error handleAccept Navbar:", error);
    }
  };

  const handleReject = async (email) => {
    try {
      if (!email) {
        toast.error("No email found.");
        return;
      }
      await deleteRequest(email);
      toast.success("Request Rejected");
    } catch (error) {
      toast.error("Error handleReject Navbar");
      console.error("Error handleReject Navbar:", error);
    }
  };

  return (
    <div>
      <header
        className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
      >
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition-all"
              >
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <img src="/logo02.png" alt="" />
                </div>
                <h1 className="text-lg font-bold">Echoes</h1>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={"/setting"}
                className={`
              btn btn-sm gap-2 transition-colors
              
              `}
              >
                <Settings2 className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {setuser && (
                <>
                  <div className="dropdown dropdown-bottom dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="flex gap-2 items-center btn btn-sm"
                    >
                      <Users className="size-5" />
                      <span className="hidden sm:inline">Requests</span>
                      {setuser.requests?.length > 0 ? (
                        <span
                          className="absolute -top-1 -left-1 size-3 bg-pink-500 
                  rounded-full "
                        />
                      ) : (
                        " "
                      )}
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-80 p-2 shadow gap-4"
                    >
                      {/* TODO: This would be dynamic */}
                      {setuser.requests?.map((user) => (
                        <li key={user._id}>
                          <div>
                            <img
                              className="inline-block size-12 rounded-full"
                              src={user.profilepic}
                              alt="/profile.png"
                            />
                            <span>{user.fullname}</span>

                            <button
                              onClick={() => handleAccept(user.email)}
                              className="btn btn-sm btn-success text-white"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(user.email)}
                              className="btn btn-sm btn-error text-white"
                            >
                              Reject
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                    <CircleUser className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <button
                    className="flex gap-2 items-center btn btn-sm bg-red-500 hover:bg-red-700 text-white"
                    onClick={logout}
                  >
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
