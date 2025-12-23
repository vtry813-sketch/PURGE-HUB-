import React from "react";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";

function NotificationCard({ noti }) {
  const navigate = useNavigate();

  return (
    <div
      className="w-full flex justify-between items-center
                 px-3 py-2 min-h-[56px]
                 bg-gray-950 rounded-full "
    >
      {/* LEFT */}
      <div className="flex gap-3 items-center min-w-0">
        {/* Avatar */}
        <div
          className="w-[40px] h-[40px]
                     rounded-full overflow-hidden
                     cursor-pointer"
        >
          <img
            src={noti.sender.profileImage || dp}
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col min-w-0 cursor-pointer">
          <span className="text-[14px] text-white font-semibold truncate">
            {noti.sender.username}
          </span>
          <span className="text-[15px] text-gray-300 truncate font-light">
            {noti.message}
          </span>
        </div>
      </div>

      {/* MEDIA PREVIEW */}
      {(noti.post || noti.loop) && (
        <div
          className="w-[40px] h-[40px]
               rounded-md overflow-hidden
               flex-shrink-0 cursor-pointer bg-black"
        >
          {/* POST IMAGE */}
          {noti.post?.mediatype === "image" && (
            <img
              src={noti.post.media?.secure_url || noti.post.media}
              className="w-full h-full object-cover"
              alt="post"
            />
          )}

          {/* POST VIDEO */}
          {noti.post?.mediatype === "video" && (
            <video
              src={noti.post.media}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          )}

          {/* LOOP VIDEO */}
          {noti.loop && (
            <video
              src={noti.loop.media}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationCard;
