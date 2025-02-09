import React, { useEffect, useState } from "react";
import { userStore } from "../ApiStore/userStore";
import { Camera, Mail, User, X } from "lucide-react";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const { setuser, isUpdateProfile, updateprofile, deleteuser } = userStore();
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    setuser;
  }, [setuser]);

  const [selectedImg, setSelectedImage] = useState(null);

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateprofile({ profilepic: base64Image });
    };
  };

  const handleDeleteAcc = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    if (confirmation.toLowerCase() !== "i confirm") {
      toast.error("Please type 'i confirm' to proceed.");
      return;
    }

    try {
      await deleteuser(email);
      // document.getElementById("my_modal_3").close();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account.");
    }
  };

  return (
    <>
      {" "}
      <div className="h-full pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* avatar upload section */}

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || setuser.profilepic || "./profile.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
              absolute bottom-0 right-0 
              bg-base-content hover:scale-105
              p-2 rounded-full cursor-pointer 
              transition-all duration-200
              ${isUpdateProfile ? "animate-pulse pointer-events-none" : ""}
            `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUploadImage}
                    disabled={isUpdateProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdateProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {setuser?.fullname}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {setuser?.email}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{setuser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
                <div className="flex flex-col items-start gap-4 py-2">
                  <span className="text-red-600">Danger Zone</span>

                  {/* Open Modal Button */}
                  <button
                    onClick={() =>
                      document.getElementById("my_modal_3").showModal()
                    }
                    className="btn btn-sm bg-red-500 hover:bg-red-700 text-white"
                  >
                    Delete Account
                  </button>

                  {/* Modal */}
                  <dialog id="my_modal_3" className="modal">
                    <div className="modal-box">
                      {/* Close Button */}
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                          <X className="size-6" />
                        </button>
                      </form>

                      {/* Delete Form */}
                      <form
                        onSubmit={handleDeleteAcc}
                        className="flex flex-col gap-2 sm:gap-3"
                      >
                        <p>
                          Enter your{" "}
                          <small className="text-red-600 font-bold text-sm">
                            Email Address
                          </small>
                        </p>
                        <input
                          type="email"
                          className="w-[70%] input input-bordered rounded-lg input-md"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />

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
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
