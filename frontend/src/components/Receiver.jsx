import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

function Receiver({ message }) {
  const navigate = useNavigate();
  const { selecteduser } = useSelector((state) => state.message);
  const [viewphoto, setviewphoto] = useState(false);
  return (
    <div className="w-full flex justify-start">
      <div className="max-w-[70%] flex items-end gap-2">
        <div
          className="w-[36px] h-[36px] rounded-full overflow-hidden cursor-pointer"
          onClick={() => navigate(`/profile/${message.sender.username}`)}
        >
          <img
            src={selecteduser?.profileImage || dp}
            className="w-full h-full object-cover  "
            alt="user"
          />
        </div>

        <div className=" cursor-pointer flex flex-col items-start gap-1">
          {message.image && (
            <div className="w-[180px] h-[180px] rounded-2xl overflow-hidden">
              <img
                onClick={() => setviewphoto(true)}
                src={message.image}
                alt="received"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {viewphoto && (
            <div
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
              onClick={() => setviewphoto(false)}
            >
              <img
                src={message.image}
                className="max-w-[90%] max-h-[90%] rounded-xl cursor-pointer object-contain"
              />
            </div>
          )}

          {message.message && (
            <div
              className="px-4 py-2 rounded-2xl rounded-bl-md
                         bg-gray-700
                         text-white text-sm break-words"
            >
              {message.message}
            </div>
          )}

          <span className="text-[10px] text-gray-400">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Receiver;
