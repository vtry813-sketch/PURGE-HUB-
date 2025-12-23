import React, { useState } from "react";
import logo from "../assets/logo2.png";
import { RiPokerHeartsLine } from "react-icons/ri";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setuserData } from "../redux/UserSlice";
import Otherusers from "./Otherusers";
import { useNavigate } from "react-router-dom";
import Notification from "../Pages/Notification";

function Lefthome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData, suggestedusers, notificationdata } = useSelector(
    (state) => state.user
  );

  const [shownotification, setshownotification] = useState(false);

  const handlelogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setuserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[25%] hidden lg:flex flex-col h-[100vh] bg-black border-r-2 border-gray-900">
      {/* ================= STICKY TOP ================= */}
      <div className="sticky top-0 z-50 bg-black">
        {/* Header */}
        <div className="w-full h-[100px] flex items-center justify-between p-[20px]">
          <img src={logo} className="w-[80px]" alt="logo" />

          <div className="relative cursor-pointer">
            <RiPokerHeartsLine
              onClick={() => setshownotification((prev) => !prev)}
              className="text-white w-[25px] h-[25px]"
            />

            {notificationdata?.length > 0 &&
              notificationdata.some((noti) => noti.isRead === false) && (
                <span
                  className="absolute -top-0.5 -right-1
                  w-[10px] h-[10px]
                  bg-gradient-to-r from-red-500 to-pink-500
                  rounded-full"
                />
              )}
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-[10px] justify-between px-[10px] pb-3">
          <div className="flex items-center gap-[10px]">
            <div
              onClick={() => navigate(`/profile/${userData?.username}`)}
              className="cursor-pointer"
            >
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-black">
                  <img
                    src={userData?.profileImage || dp}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="text-[18px] text-white font-semibold">
                {userData?.username}
              </div>
              <div className="text-[13px] text-gray-400">{userData?.name}</div>
            </div>
          </div>

          <span
            onClick={handlelogout}
            className="text-blue-500 font-semibold cursor-pointer"
          >
            Log Out
          </span>
        </div>

        <div className="bg-gradient-to-r from-transparent via-gray-700 to-transparent h-[2px] w-full" />
      </div>

      {/* ================= SCROLLABLE CONTENT ================= */}
      <div className="flex-1 overflow-y-auto">
        {!shownotification && (
          <div className="w-full flex flex-col gap-[20px] p-[20px]">
            <h1 className="text-white font-semibold md:text-transparent md:bg-clip-text md:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)]">
              Suggested for You
            </h1>

            {suggestedusers?.slice(0, 6).map((user) => (
              <Otherusers key={user._id} user={user} />
            ))}
          </div>
        )}

        {shownotification && <Notification />}
      </div>
    </div>
  );
}

export default Lefthome;
