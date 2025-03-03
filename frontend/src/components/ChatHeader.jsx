import { X, EllipsisVertical } from "lucide-react";
import { userStore } from "../ApiStore/userStore";
import { useChatStore } from "../ApiStore/useChatStore";
import { toast } from "react-hot-toast";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, blockContact, deleteMessage } =
    useChatStore();
  const { onlineUsers, setuser } = userStore();
  const [confirmation, setConfirmation] = useState("");

  const handleBlock = async () => {
    try {
      await blockContact(selectedUser.email);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error);
      console.log("Error in block contact", error);
    }
  };

  const handleDeleteMessage = async (e) => {
    e.preventDefault();
    if (confirmation.toLowerCase() !== "i confirm") {
      toast.error("Please type 'i confirm' to proceed.");
      return;
    }

    try {
      await deleteMessage(setuser._id, selectedUser._id);
    } catch (error) {
      toast.error(error);
      console.log("Error in block contact", error);
    }
  };
  return (
    <div className="p-2 border-b border-base-300 sm:-mt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilepic || "/profile.png"}
                alt={selectedUser.fullname}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex flex-row place-content-between ">
          {/* More settings */}
          <div className="dropdown dropdown-bottom dropdown-end">
            <div className="flex">
              <div tabIndex={0} role="button" className="me-5 shadow-full">
                <EllipsisVertical />
              </div>
              <button onClick={() => setSelectedUser(null)}>
                <X />
              </button>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow gap-4"
            >
              <li>
                <button
                  onClick={handleBlock}
                  className=" btn btn-sm bg-gray-500 hover:bg-red-500 text-white"
                >
                  Block
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document.getElementById("my_modal_31").showModal()
                  }
                  className=" btn btn-sm bg-gray-500 hover:bg-red-500 text-white"
                >
                  Delete Chat
                </button>
              </li>
            </ul>
          </div>
          {/* Close button */}

          {/* Modal */}
          <dialog id="my_modal_31" className="modal">
            <div className="modal-box">
              {/* Close Button */}
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  <X className="size-6" />
                </button>
              </form>

              {/* Delete Form */}
              <form
                onSubmit={handleDeleteMessage}
                className="flex flex-col gap-2 sm:gap-3"
              >
                <p>
                  Write{" "}
                  <small className="text-red-600 font-bold text-sm">
                    i confirm
                  </small>
                </p>
                <input
                  type="text"
                  className="w-[70%] input input-bordered rounded-lg input-md"
                  placeholder="Type 'i confirm'"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                />

                {/* Confirm Button (Should be type="submit") */}
                <button
                  className="w-[30%] btn btn-sm bg-red-500 hover:bg-red-700 text-white"
                  type="submit"
                >
                  Confirm
                </button>
              </form>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
