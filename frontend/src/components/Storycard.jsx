import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { HiPlusSm } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
function Storycard({ profileImage, username, story }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { storyData, storyList } = useSelector((state) => state.story);
  const [viewed, setviewed] = useState(false);

  useEffect(() => {
    if (
      story?.viewers?.some(
        (viewer) =>
          viewer?._id?.toString() === userData?._id?.toString() ||
          viewer?.toString() == userData._id?.toString()
      )
    ) {
      setviewed(true);
    } else {
      setviewed(false);
    }
  }, [story, userData, storyList, storyData]);

  const handleviewers = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/story/view/${story._id}`,
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (!story && username.toLowerCase() === "your story") {
      navigate("/upload");
    } else if (story && username.toLowerCase() === "your story") {
      handleviewers();
      navigate(`/story/${userData.username}`);
    } else {
      handleviewers();
      navigate(`/story/${username}`);
    }
  };
  return (
    <div className="flex flex-col items-center gap-[5px]">
      <div
        onClick={handleClick}
        className={`w-[76px] h-[76px] ${
          !story
            ? null
            : !viewed
            ? "bg-[linear-gradient(to_left,_#a855f7,_#ec4899,_#ef4444,_#facc15)]"
            : "bg-white/50"
        }  rounded-full p-[3px] flex items-center justify-center relative`}
      >
        <div className="w-[68px] h-[68px] bg-black rounded-full overflow-hidden cursor-pointer">
          <img
            src={profileImage || dp}
            alt="user story"
            className="w-full h-full object-cover"
          />
          {!story && username == "Your Story" && (
            <div>
              {" "}
              <HiPlusSm className="text-white/90 w-[18px] bg-blue-500 rounded-full  h-[18px] cursor-pointer absolute bottom-[2px] right-[2px]" />
            </div>
          )}
        </div>
      </div>

      {/* Username text */}
      <div className="text-white text-[13px] font-light truncate w-[80px] text-center cursor-pointer">
        {username || "Username"}
      </div>
    </div>
  );
}

export default Storycard;
