import React from "react";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../ApiStore/useChatStore";
import ChatContainer from "../components/ChatContainer";
import { useMediaQuery } from "react-responsive";

const HomePage = () => {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const { selectedUser } = useChatStore();
  return (
    <div className="h-dvh">
      <div className="flex items-center justify-center pt-16 px-2 sm:pt-20 sm:px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-6rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {isLargeScreen ? (
              !selectedUser ? (
                <>
                  <Sidebar />
                  <NoChatSelected />
                </>
              ) : (
                <>
                  <Sidebar />
                  <ChatContainer />
                </>
              )
            ) : !selectedUser ? (
              <Sidebar />
            ) : (
              <ChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
