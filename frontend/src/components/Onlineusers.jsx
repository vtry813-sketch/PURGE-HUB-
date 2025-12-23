import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import { setselecteduser } from "../redux/MessageSlice";

function Onlineusers({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setselecteduser(user));
    navigate("/textarea");
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center gap-1
                 min-w-[70px]
                 cursor-pointer"
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-[#0095ff]">
          <img
            src={user.profileImage || dp}
            className="w-full h-full object-cover"
            alt="user"
          />
        </div>

        {/* Online dot */}
        <span
          className="absolute bottom-0 right-0
                         w-[10px] h-[10px]
                         bg-[#00ff6a]
                         border-2 border-black
                         rounded-full"
        />
      </div>

      {/* Username */}
      <span className="text-[11px] text-white truncate max-w-[60px]">
        {user.username}
      </span>
    </div>
  );
}

export default Onlineusers;
