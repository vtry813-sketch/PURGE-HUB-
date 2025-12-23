import React from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import Followbutton from "./Followbutton";

function Otherusers({ user }) {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="relative w-full h-[80px] flex items-center justify-between px-[10px]">
      <div
        className="absolute bottom-0 left-0 w-full h-[1.5px]
               bg-gradient-to-r from-transparent via-gray-700 to-transparent"
      />

      <div className="flex items-center gap-[10px]">
        <div
          onClick={() => navigate(`/profile/${user.username}`)}
          className="cursor-pointer"
        >
          <div className="p-[px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-black">
              <img
                src={user.profileImage || dp}
                className="w-full h-full object-cover"
                alt="user"
              />
            </div>
          </div>
        </div>

        {/* User info */}
        <div>
          <div className="text-[18px] text-white font-semibold">
            {user.username}
          </div>
          <div className="text-[13px] text-gray-400">{user.name}</div>
        </div>
      </div>

      {/* Right side: Follow button */}
      <Followbutton
        tailwind={
          "px-[10px] w-[100px] py-[5px] h-[40px] bg-white rounded-2xl flex items-center justify-center font-semibold cursor-pointer hover:bg-blue-500 transition"
        }
        targertuserId={user._id}
      />
    </div>
  );
}

export default Otherusers;
