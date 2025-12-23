import React, { useRef, useEffect, useState } from "react";
import { GoUnmute, GoMute } from "react-icons/go";
import { LiaComments } from "react-icons/lia";
import { GoBookmark } from "react-icons/go";
import { GoBookmarkFill } from "react-icons/go";
import { IoSend } from "react-icons/io5";
import { PiShareFatLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import Followbutton from "./Followbutton";
import { useDispatch, useSelector } from "react-redux";
import { RiMore2Fill } from "react-icons/ri";
import axios from "axios";
import { serverUrl } from "../App";
import { removeLoop, setloopData } from "../redux/LoopSlice";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { setuserData } from "../redux/UserSlice";
import Getallloops from "../Hooks/Getallloops";
import { RxDownload } from "react-icons/rx";

function Loopcard({ loop }) {
  const videoRef = useRef(null);
  const [mute, setmute] = useState(false);
  const [playing, setplaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const { loopData } = useSelector((state) => state.loop);
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showcomment, setshowcomment] = useState(false);
  const [message, setmessage] = useState("");
  const { socket } = useSelector((state) => state.socket);

  const handlevideo = () => {
    if (playing) {
      videoRef.current.pause();
      setplaying(false);
    } else {
      videoRef.current.play();
      setplaying(true);
    }
  };
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) videoRef.current.play();
        else videoRef.current.pause();
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const updateProgress = () => {
      const percent = (v.currentTime / v.duration) * 100;
      setProgress(percent || 0);
    };

    v.addEventListener("timeupdate", updateProgress);
    return () => v.removeEventListener("timeupdate", updateProgress);
  }, []);

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

    await axios.delete(`${serverUrl}/api/loop/remove/${loop._id}`, {
      withCredentials: true,
    });

    dispatch(removeLoop(loop._id));
    stopAllVideos();
  };

  const handlelike = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/loop/like/${loop._id}`,
        { withCredentials: true }
      );
      const updatedloop = response.data;
      const updatedloops = loopData.map((l) =>
        l._id == loop._id ? updatedloop : l
      );
      dispatch(setloopData(updatedloops));
    } catch (error) {
      console.log(error);
    }
  };

  const handlecomment = async () => {
    if (!message) return;
    try {
      const response = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedloop = response.data;
      const updatedloops = loopData.map((l) =>
        l._id == loop._id ? updatedloop : l
      );
      dispatch(setloopData(updatedloops));
      setmessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handlesave = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/loop/saved/${loop._id}`,
        { withCredentials: true }
      );

      dispatch(setuserData(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handledownload = async () => {
    const link = document.createElement("a");
    link.href = loop.media;
    link.setAttribute("download", `loop-${loop._id}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    socket.on("likedloop", (updatedData) => {
      const updatedloop = loopData.map((p) =>
        p._id == updatedData.loopId ? { ...p, likes: updatedData.likes } : p
      );
      dispatch(setloopData(updatedloop));
    });
    socket.on("loopcomment", (updatedData) => {
      const updatedloop = loopData.map((p) =>
        p._id == updatedData.loopId
          ? { ...p, comments: updatedData.comments }
          : p
      );
      dispatch(setloopData(updatedloop));
    });
  }, [loopData]);

  return (
    <div className="relative w-full h-screen flex justify-center items-center lg:w-[480px]">
      {/* VIDEO */}
      <video
        crossOrigin="anonymous"
        onClick={handlevideo}
        ref={videoRef}
        src={loop?.media}
        loop
        muted={mute}
        playsInline
        preload="none"
        className="w-full h-full object-cover"
      />

      {/* MUTE BUTTON */}
      <div
        onClick={() => {
          setmute((prev) => !prev);
        }}
        className="absolute top-5 right-5 z-[100] cursor-pointer"
      >
        {!mute ? (
          <GoUnmute className="text-white w-[26px] h-[26px]" />
        ) : (
          <GoMute className="text-white w-[26px] h-[26px]" />
        )}
      </div>

      {/* RIGHT ICON BAR  */}
      <div className="absolute right-3 bottom-24 z-[99999] flex flex-col items-center gap-5">
        {/* LIKE */}
        <div className="flex flex-col items-center cursor-pointer active:scale-90">
          {!loop.likes.includes(userData._id) ? (
            <BsHeart
              className="text-white w-[25px] h-[25px]"
              onClick={handlelike}
            />
          ) : (
            <BsHeartFill
              className="text-red-500 w-[25px] h-[25px]"
              onClick={handlelike}
            />
          )}
          <span className="text-white text-[13px] mt-1">
            {loop.likes.length}
          </span>
        </div>

        {/* COMMENT */}
        <div className="flex flex-col items-center cursor-pointer">
          <LiaComments
            onClick={() => setshowcomment(!showcomment)}
            className="text-white w-[25px] h-[25px] "
          />
          <span className="text-white text-[13px] mt-1">
            {loop.comments.length}
          </span>
        </div>
        {/* SAVE */}
        <div
          onClick={handlesave}
          className="flex flex-col items-center cursor-pointer active:scale-90"
        >
          {!userData.savedloop?.includes(loop._id) && (
            <GoBookmark className="text-white w-[25px] h-[25px]" />
          )}
          {userData.savedloop?.includes(loop._id) && (
            <GoBookmarkFill className="text-black w-[25px] h-[25px]" />
          )}
        </div>

        {/* SHARE */}
        <div
          onClick={handledownload}
          className="flex flex-col items-center cursor-pointer active:scale-90"
        >
          <RxDownload className="text-white w-[25px] h-[25px]" />
        </div>
      </div>

      {/* COMMENT block */}
      {showcomment && (
        <div
          className="absolute bottom-0 left-0 w-full h-[70%] bg-black rounded-4xl backdrop-blur-sm z-[99999] flex flex-col justify-end"
          onClick={() => setshowcomment(false)}
        >
          <div
            className="bg-black w-full h-full rounded-t-2xl p-4 animate-[slideUp_0.25s_ease-out]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3 cursor-pointer"
              onClick={() => setshowcomment(false)}
            ></div>

            <h2 className="text-[17px] font-semibold mb-3 text-neutral-200">
              Comments
            </h2>

            <div className="overflow-y-auto h-[78%] space-y-4 pr-1">
              {loop.comments.length === 0 && (
                <p className="text-neutral-300 text-sm text-center">
                  No comments yet.
                </p>
              )}

              {loop.comments.map((c) => (
                <div key={c._id} className="flex items-start gap-3 ">
                  <img
                    src={c.author.profileImage || dp}
                    onClick={() => navigate(`/profile/${userData.username}`)}
                    className="w-9 h-9 rounded-full object-cover cursor-pointer z-100 "
                  />
                  <div>
                    <p className="text-sm  text-neutral-200">
                      {c.author.username}
                    </p>
                    <p className="text-sm text-neutral-400 font-light break-all">
                      {c.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="absolute bottom-4 left-0 w-full px-4">
              <div className="flex items-center gap-2 w-full">
                <img
                  src={userData.profileImage || dp}
                  onClick={() => navigate(`/profile/${userData.username}`)}
                  className="w-9 h-9 rounded-full object-cover cursor-pointer"
                />

                <div className="flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 flex-1">
                  <input
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent text-white text-sm outline-none"
                    onChange={(e) => setmessage(e.target.value)}
                    value={message}
                  />
                  <IoSend
                    onClick={handlecomment}
                    className="text-blue-500 w-5 h-5 ml-2 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER INFO */}
      <div className="absolute bottom-10 left-0 w-full px-4 flex flex-col gap-1 z-[100]">
        <div className="flex items-center justify-start gap-3">
          <div
            className="w-[40px] h-[40px] rounded-full p-[2px]
        bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)] cursor-pointer"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-black">
              <img
                onClick={() => navigate(`/profile/${loop.author.username}`)}
                src={loop.author?.profileImage || dp}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div
            onClick={() => navigate(`/profile/${loop.author.username}`)}
            className="text-white text-[15px] font-semibold truncate max-w-[150px] cursor-pointer"
          >
            {loop.author?.username}
          </div>

          {userData._id !== loop.author?._id && (
            <Followbutton
              targertuserId={loop.author._id}
              tailwind="px-2 py-1.5 bg-black/30 text-white rounded text-[10px] active:scale-95"
            />
          )}
          {/* DELETE MENU */}
          {userData._id == loop.author?._id && (
            <div className="absolute right-3 bottom-2 z-[100]">
              <RiMore2Fill
                className="text-white cursor-pointer w-[25px] h-[25px]"
                onClick={() => setShowMenu(!showMenu)}
              />
              {showMenu && (
                <div className="absolute right-5 bottom-[-12px] bg-white/20 shadow-lg rounded-lg p-2 w-[120px] z-[100]">
                  <button
                    onClick={handleremove}
                    className="block w-full text-left text-black px-2 py-1 rounded-md hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-white text-[13px] w-[280px] md:w-[380px] break-all">
          {loop?.caption && (
            <div className="flex flex-col w-full px-[2px] py-[2px] gap-[2px] justify-start mb-[2px]">
              <div
                className="text-white break-words cursor-pointer font-light"
                onClick={() => setShowFullCaption((prev) => !prev)}
              >
                {loop.caption.length > 100 ? (
                  <>
                    {showFullCaption
                      ? loop.caption
                      : loop.caption.substring(0, 50)}
                    {!showFullCaption && "... "}
                    {!showFullCaption && (
                      <span className="text-blue-500 font-medium">more</span>
                    )}
                    {showFullCaption && (
                      <span className="text-blue-500 font-medium"> less</span>
                    )}
                  </>
                ) : (
                  loop.caption
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/30">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-white transition-all duration-100"
        ></div>
      </div>
    </div>
  );
}

export default Loopcard;
