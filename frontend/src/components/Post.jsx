import React, { useEffect, useRef, useState } from "react";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import Videoplayer from "./Videoplayer";
import { useDispatch, useSelector } from "react-redux";
import { BsHeart } from "react-icons/bs";
import { BsHeartFill } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import { BsBookmarkFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import { removePost, setpostData } from "../redux/PostSlice";
import { setuserData } from "../redux/UserSlice";
import Followbutton from "./Followbutton";

import { RiMore2Fill } from "react-icons/ri";
import { GoUnmute, GoMute } from "react-icons/go";
function Post({ post }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const [showcomment, setshowcomment] = useState(false);
  const [message, setmessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [mute, setmute] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const videoref = useRef(null);

  const { socket } = useSelector((state) => state.socket);
  const handlelike = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/post/like/${post._id}`,
        { withCredentials: true }
      );
      const updatedpost = response.data;
      const updatedposts = postData.map((p) =>
        p._id == post._id ? updatedpost : p
      );
      dispatch(setpostData(updatedposts));
    } catch (error) {
      console.log(error);
    }
  };

  const handlecomment = async () => {
    if (!message) {
      return;
    }
    try {
      const response = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedpost = response.data;
      const updatedposts = postData.map((p) =>
        p._id == post._id ? updatedpost : p
      );
      dispatch(setpostData(updatedposts));
      setmessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handlesave = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        { withCredentials: true }
      );
      dispatch(setuserData(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const stopAllVideos = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((v) => {
      v.pause();
      v.muted = true;
    });
  };

  const handleremove = async () => {
    const sure = window.confirm("Are you sure you want to delete this post?");
    if (!sure) return;

    try {
      await axios.delete(`${serverUrl}/api/post/remove/${post._id}`, {
        withCredentials: true,
      });

      dispatch(removePost(post._id));
      stopAllVideos();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("likedpost", (updatedData) => {
      const updatedposts = postData.map((p) =>
        p._id == updatedData.postId ? { ...p, likes: updatedData.likes } : p
      );
      dispatch(setpostData(updatedposts));
    });
    socket.on("comment", (updatedData) => {
      const updatedposts = postData.map((p) =>
        p._id == updatedData.postId
          ? { ...p, comments: updatedData.comments }
          : p
      );
      dispatch(setpostData(updatedposts));
    });
  }, []);

  return (
    <div className="w-[95%] min-h-auto flex flex-col gap-[10px] bg-white shadow-[#00000058] items-center shadow-2xl rounded-[30px] md:rounded-[40px]">
      <div className="w-full h-[80px] flex justify-between items-center px-[3px] md:px-[10px]">
        <div className="w-full h-[80px] flex justify-between items-center px-[10px] ">
          <div className="flex items-center justify-between w-full cursor-pointer">
            {/* LEFT SIDE — DP + USERNAME */}
            <div className="flex items-center gap-3">
              {/* DP Outer Ring */}
              <div
                className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full p-[3px]
                bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)]"
              >
                {/* DP Image */}
                <div className="w-full h-full rounded-full overflow-hidden bg-black">
                  <img
                    onClick={() => navigate(`/profile/${post.author.username}`)}
                    src={post.author?.profileImage || dp}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* USERNAME */}
              <div
                onClick={() => navigate(`/profile/${post.author.username}`)}
                className="text-[14px] md:text-[16px] font-semibold truncate w-[100px] md:w-[150px]"
              >
                {post.author?.username}
              </div>
            </div>

            {/* FOLLOW BUTTON — NOW AT RIGHT END */}
            {userData._id != post.author?._id && (
              <Followbutton
                targertuserId={post.author._id}
                tailwind={
                  "px-3 md:px-4 py-2 md:py-2 bg-black text-white rounded-full text-[13px] md:text-[15px] font-medium hover:bg-blue-500 hover:text-black active:scale-95 transition"
                }
              />
            )}
            {userData._id == post.author?._id && (
              <div className="relative">
                <RiMore2Fill
                  className="text-black w-[24px] h-[25px] cursor-pointer"
                  onClick={() => setShowMenu(!showMenu)}
                />

                {showMenu && (
                  <div className="absolute right-0 top-6 bg-white shadow-lg rounded-lg p-2 w-[120px] z-50">
                    <button
                      onClick={handleremove}
                      className="block w-full text-left text-black px-2 py-1 rounded-md hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {post.mediatype == "image" && (
        <div className="w-[305px] md:w-auto h-auto md:h-[500px] overflow-hidden rounded flex justify-center  items-center bg-black">
          <img
            className="w-fit md:w-full h-auto md:h-full object-cover"
            src={post.media}
            alt=""
          />
        </div>
      )}
      {post.mediatype == "video" && (
        <div className="w-[95%] max-h-[700px] overflow-hidden relative rounded-2xl flex justify-center items-center bg-black">
          <div
            onClick={() => setmute((prev) => !prev)}
            className="absolute bottom-[10px] right-[10px] z-100"
          >
            {!mute ? (
              <GoUnmute className="text-white w-[22px] h-[22px]" />
            ) : (
              <GoMute className="text-white w-[22px] h-[22px]" />
            )}
          </div>
          <Videoplayer media={post.media} mute={mute} videoref={videoref} />
        </div>
      )}
      <div className="w-full px-5 flex justify-start items-center gap-[2px] md:gap-[5px] mb-[12px] md:mb-[20px]">
        {!post.likes.includes(userData._id) && (
          <BsHeart
            onClick={handlelike}
            className="h-[25px] w-[25px] cursor-pointer"
          />
        )}
        {post.likes.includes(userData._id) && (
          <BsHeartFill
            onClick={handlelike}
            className="h-[25px] w-[25px] text-red-500 cursor-pointer"
          />
        )}
        <span className="text-[16px] font-medium">{post.likes.length}</span>
        <div className="w-full px-5 flex justify-start items-center gap-2">
          <FaRegCommentDots
            onClick={() => setshowcomment((prev) => !prev)}
            className="h-[21px] w-[21px] cursor-pointer"
          />
          <span className="text-[16px] font-medium">
            {post.comments.length}
          </span>
        </div>
        <div onClick={handlesave} className="cursor-pointer">
          {!userData.savedpost?.includes(post?._id) && (
            <BsBookmark className="h-[20px] w-[20px]" />
          )}
          {userData.savedpost?.includes(post?._id) && (
            <BsBookmarkFill className="h-[20px] w-[20px]" />
          )}
        </div>
      </div>
      {post.caption && (
        <div className="flex flex-col w-full px-[20px] gap-[2px] justify-start mb-[15px]">
          {/* Username */}
          <h1 className="text-black font-semibold">{post.author?.username}</h1>

          {/* Caption */}
          <div
            className="text-black break-words cursor-pointer text-[10px] md:text-[12px] font-medium"
            onClick={() => setShowFullCaption((prev) => !prev)}
          >
            {post.caption.length > 100 ? (
              <>
                {showFullCaption ? post.caption : post.caption.substring(0, 70)}
                {!showFullCaption && "... "}
                {!showFullCaption && (
                  <span className="text-blue-500 font-medium">more</span>
                )}
                {showFullCaption && (
                  <span className="text-blue-500 font-medium"> less</span>
                )}
              </>
            ) : (
              post.caption
            )}
          </div>
        </div>
      )}

      {showcomment && (
        <div className="w-full flex flex-col gap-4 pb-4 px-3">
          {/* USER PROFILE PIC + INPUT + SEND */}
          <div className="flex items-center gap-3 w-full cursor-pointer">
            {/* DP */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-black flex-shrink-0">
              <img
                onClick={() => navigate(`/profile/${userData.username}`)}
                src={userData.profileImage || dp}
                className="w-full h-full object-cover"
              />
            </div>

            {/* INPUT */}
            <input
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none 
        focus:border-black"
              placeholder="Write a comment..."
              onChange={(e) => setmessage(e.target.value)}
              value={message}
              required
            />

            {/* SEND BUTTON */}
            <button
              onClick={handlecomment}
              className="text-black text-[22px] cursor-pointer"
            >
              <IoSend />
            </button>
          </div>

          {/* COMMENTS SCROLLER */}
          <div className="w-full max-h-[300px] overflow-auto flex flex-col gap-4">
            {post.comments.map((com, index) => (
              <div key={index} className="flex items-start gap-3">
                {/* COMMENT USER DP */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-black flex-shrink-0">
                  <img
                    onClick={() => navigate(`/profile/${com.author.username}`)}
                    src={com.author?.profileImage || dp}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </div>

                {/* USERNAME + MESSAGE */}
                <div className="flex flex-col">
                  <span className="font-semibold text-[14px] cursor-pointer">
                    {com.author?.username}
                  </span>
                  <span className="text-[14px] break-all text-black/80">
                    {com.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
