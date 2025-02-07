import React from "react";
import { userStore } from "../ApiStore/userStore";
import { Link } from "react-router-dom";
import { LogOut, CircleUser, Settings2 } from "lucide-react";

const Navbar = () => {
  const { setuser, logout } = userStore();

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
