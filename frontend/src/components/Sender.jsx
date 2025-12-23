import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";

function Sender({ message }) {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-end">
      <div className="flex items-end gap-1 max-w-[80%]">
        {/* Message content */}
        <div className="flex flex-col items-end gap-1">
          {/* Image bubble */}
          {message.image && (
            <>
              <div className="w-[180px] h-[180px] rounded-2xl overflow-hidden">
                <img
                  src={message.image}
                  alt="sent"
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>

              {/* Fullscreen preview */}
            </>
          )}

          {/* Text bubble */}
          {message.message && (
            <div
              className="
                px-4 py-2
                rounded-2xl rounded-br-md
                bg-gradient-to-r from-purple-500 to-pink-500
                text-white text-sm
                whitespace-pre-wrap
                break-all
                max-w-full
              "
            >
              {message.message}
            </div>
          )}

          {/* Time */}
          <span className="text-[10px] text-gray-400 mt-0.5">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Avatar */}
        <div
          className="w-[36px] h-[36px] rounded-full overflow-hidden cursor-pointer shrink-0"
          onClick={() => navigate(`/profile/${userData.username}`)}
        >
          <img
            src={userData?.profileImage || dp}
            className="w-full h-full object-cover"
            alt="user"
          />
        </div>
      </div>
    </div>
  );
}

export default Sender;
