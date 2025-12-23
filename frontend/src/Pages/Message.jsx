import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Onlineusers from "../components/Onlineusers";
import { setselecteduser } from "../redux/MessageSlice";
import dp from "../assets/dp.webp";

function Message() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const { onlineuser } = useSelector((state) => state.socket);
  const { prevuser } = useSelector((state) => state.message);

  const isOnline = (id) => onlineuser?.includes(id?.toString());

  return (
    <div className="bg-black h-screen flex flex-col">
      {/* Header */}
      <div className="p-5 flex items-center gap-3 border-b border-gray-800">
        <IoMdArrowRoundBack
          className="h-[20px] w-[20px] text-white cursor-pointer active:scale-95 transition lg:hidden"
          onClick={() => navigate(`/`)}
        />
        <h2
          className="text-[22px] font-semibold text-white
                       md:text-transparent md:bg-clip-text
                       md:bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)]"
        >
          Messages
        </h2>
      </div>

      {/* Online users (STACKED) */}
      <div className="h-[90px] flex gap-4 items-center overflow-x-auto px-4 border-b border-gray-800 mt-2 ">
        {userData.following
          ?.filter((user) => isOnline(user._id))
          .map((user) => (
            <Onlineusers key={user._id} user={user} />
          ))}
      </div>

      {/* Previous chats */}
      <div className="flex-1 overflow-auto">
        {prevuser?.map((user) => (
          <>
            <div
              key={user._id}
              onClick={() => {
                dispatch(setselecteduser(user));
                navigate("/textarea");
              }}
              className="flex items-center gap-3 px-4 py-3
                       cursor-pointer hover:bg-gray-950 transition"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-blue-500">
                  <img
                    src={user.profileImage || dp}
                    className="w-full h-full object-cover"
                    alt="user"
                  />
                </div>
              </div>

              {/* User info */}
              <div className="flex flex-col">
                <span className="text-white text-[16px] font-semibold">
                  {user.username}
                </span>

                {isOnline(user._id) ? (
                  <span className="text-blue-500 text-[13px]">Active now</span>
                ) : (
                  <span className="text-neutral-200 text-[16px] font-extralight">
                    {user.name}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-r from-transparent via-gray-700  to-transparent h-[1px] w-full mt-[10px]" />
          </>
        ))}
      </div>
    </div>
  );
}

export default Message;
