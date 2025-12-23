import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import Videoplayer from "./Videoplayer";
import { GoUnmute, GoMute } from "react-icons/go";
import axios from "axios";
import { serverUrl } from "../App";
import { removestory, setstoryData } from "../redux/StorySlice";
import { RiMore2Fill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
function Storypage({ storyData }) {
  //const { storyData } = useSelector((state) => state.story);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mute, setmute] = useState(false);
  const [progress, setprogress] = useState(0);
  const videoref = useRef(null);
  const [playing, setisplaying] = useState(true);
  const { userData } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [view, setview] = useState(false);

  const handlevideo = async () => {
    if (playing) {
      videoref.current.pause();
      setisplaying(false);
    } else {
      videoref.current.play();
      setisplaying(true);
    }
  };
  // IMAGE → 15 sec timer
  useEffect(() => {
    if (storyData?.mediatype === "image") {
      let time = 0;
      const timer = setInterval(() => {
        time += 100;
        setprogress((time / 15000) * 100);

        if (time >= 15000) {
          clearInterval(timer);
          navigate("/");
        }
      }, 100);

      return () => clearInterval(timer);
    }
  }, [storyData]);

  useEffect(() => {
    if (storyData?.mediatype === "video") {
      const v = videoref.current;
      if (!v) return;

      const updateProgress = () => {
        const percent = (v.currentTime / v.duration) * 100;
        setprogress(percent || 0);
        if (v.currentTime >= v.duration) {
          navigate("/");
        }
      };

      v.addEventListener("timeupdate", updateProgress);

      return () => v.removeEventListener("timeupdate", updateProgress);
    }
  }, [storyData, navigate]);
  const stopAllVideos = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((v) => {
      v.pause();
      v.muted = true;
    });
  };

  const handleremove = async () => {
    const sure = window.confirm("Are You Sure You Want To Delete Story");
    if (!sure) return;
    try {
      await axios.delete(`${serverUrl}/api/story/remove/${storyData._id}`, {
        withCredentials: true,
      });
      dispatch(removestory());
      dispatch(setstoryData());
      stopAllVideos();
      //window.location.href = "/";
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full  max-w-[500px]  h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col items-center justify-center">
      <div className="absolute top-1 left-0 w-full h-[3px] bg-white/30">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-white transition-all duration-100"
        ></div>
      </div>
      <div className="absolute top-6 left-0 w-full px-4 flex flex-col gap-1 z-[100] ">
        <div className="flex items-center justify-start gap-3">
          <div
            onClick={() => navigate(`/`)}
            className="text-white  text-[15px] font-semibold truncate max-w-[150px] cursor-pointer"
          >
            <IoMdArrowRoundBack className="w-[20px] h-[20px]" />
          </div>
          <div
            className="w-[40px] h-[40px] rounded-full p-[1px]
              bg-white cursor-pointer"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <img
                onClick={() =>
                  navigate(`/profile/${storyData.author?.username}`)
                }
                src={storyData?.author?.profileImage || dp}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div
            onClick={() => navigate(`/profile/${storyData.author?.username}`)}
            className="text-white  text-[15px] font-semibold truncate max-w-[150px] cursor-pointer"
          >
            {storyData?.author?.username}
          </div>

          {storyData?.mediatype === "video" && (
            <div
              onClick={() => setmute((prev) => !prev)}
              className="absolute bottom-[10px] right-[25px] z-100"
            >
              {!mute ? (
                <GoUnmute className="w-[20px] h-[20px] text-white" />
              ) : (
                <GoMute className="w-[20px] h-[20px] text-white" />
              )}
            </div>
          )}
          {storyData?.author._id === userData._id && (
            <div className="absolute right-0 bottom-2 z-[100]">
              <RiMore2Fill
                className="text-white cursor-pointer w-[25px] h-[25px]"
                onClick={() => setShowMenu(!showMenu)}
              />
              {showMenu && (
                <div className="absolute right-1 top-[25px] bg-white/20 shadow-lg rounded-lg p-2 w-[120px] z-[100]">
                  <button
                    onClick={handleremove}
                    className="block w-full text-left text-white px-2 py-1 rounded-md hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {storyData?.author._id === userData._id && (
        <div className="absolute left-2 bottom-10 flex flex-col">
          <div className="flex items-center gap-2 bg-black/40 rounded-full">
            <FaRegEye
              onClick={() => setview((prev) => !prev)}
              className="text-white h-[20px] w-[20px] cursor-pointer"
            />

            <span className="text-white text-[16px]">
              {storyData.viewers.length}
            </span>
          </div>

          <div className="flex items-center mt-2">
            {storyData?.viewers
              ?.slice(-3)
              .reverse()
              .map((viewer, index) => (
                <div
                  key={index}
                  className="w-[30px] h-[30px] rounded-full border border-black overflow-hidden"
                  style={{
                    marginLeft: index === 0 ? "0px" : "-10px",
                  }}
                >
                  <img
                    src={viewer.profileImage || dp}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {view && (
        <div
          onClick={() => setview(false)}
          className="absolute bottom-0 left-0 w-full h-[60%] bg-black/20 backdrop-blur-md 
      animate-[slideUp_0.3s_ease-out] rounded-t-2xl p-4"
        >
          <div
            onClick={() => setview(false)}
            className="items-center cursor-pointer m-auto w-[50px] h-[5px] bg-white rounded-full"
          />
          <h2 className="text-white text-lg font-semibold mb-3">
            Viewers {storyData.viewers.length}
          </h2>
          <div className="overflow-y-auto h-[90%] space-y-4">
            {storyData.viewers.length === 0 && (
              <p className="text-gray-300 text-center text-sm">
                No viewers yet
              </p>
            )}

            {storyData.viewers.map((v, index) => (
              <div key={index} className="flex items-center gap-3">
                <img
                  src={v.profileImage || dp}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-white text-sm">{v.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {storyData?.mediatype == "image" && (
        <div className="w-fit md:w-fit h-auto md:h-auto overflow-hidden rounded flex justify-center items-center bg-black">
          <img
            className="w-full h-full object-cover"
            src={storyData.media}
            alt=""
          />
        </div>
      )}
      {storyData?.mediatype == "video" && (
        <div className="w-fit h-auto overflow-hidden relative rounded-2xl flex justify-center items-center bg-black">
          <video
            onClick={handlevideo}
            autoPlay
            ref={videoref}
            src={storyData?.media}
            muted={mute}
            playsInline
            preload="none"
            className="w-full h-[calc(100%-100px)] object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default Storypage;
