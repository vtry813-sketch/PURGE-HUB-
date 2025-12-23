import React from "react";
import logo from "../assets/logo2.png";
import { RiPokerHeartsLine } from "react-icons/ri";
import Storycard from "./Storycard";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import Post from "./Post";
import { LuMessageCircleMore } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
function Feed() {
  const { postData } = useSelector((state) => state.post);
  const { userData } = useSelector((state) => state.user);
  const { storyList } = useSelector((state) => state.story);
  const { notificationdata } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="w-full h-[60px] flex items-center justify-between px-5 lg:hidden bg-black">
        <img src={logo} className="w-[80px]" alt="vybe" />

        <div className="flex items-center gap-2 relative">
          <div className="relative cursor-pointer">
            <RiPokerHeartsLine
              onClick={() => navigate("/notification")}
              className="text-white w-[25px] h-[25px]"
            />

            {notificationdata?.length > 0 &&
              notificationdata.some((noti) => noti.isRead == false) && (
                <span
                  className="absolute -top-0.5 -right-1
                         w-[10px] h-[10px]
                         bg-gradient-to-r from-red-500 to-pink-500
                         rounded-full"
                />
              )}
          </div>
          <LuMessageCircleMore
            className="text-white w-6 h-6 cursor-pointer"
            onClick={() => navigate("/message")}
          />
        </div>
      </div>

      <div className="flex w-full overflow-x-auto whitespace-nowrap gap-[10px] lg:gap-[18px] items-center mt-[-20px] lg:mt-[0px] lg:p-[20px] p-[10px] ">
        <Storycard
          username={"Your Story"}
          profileImage={userData.profileImage}
          story={userData.story}
        />

        {storyList.map((story, index) => (
          <Storycard
            profileImage={story.author.profileImage}
            story={story}
            username={story.author.username}
            key={index}
          />
        ))}
      </div>
      <div className="w-[calc(100%-20px)] min-h-[100vh] flex flex-col items-center gap-[15px]  pt-[20px] bg-white rounded-t-[30px] lg:rounded-t-[40px] relative pb-[120px] mx-[10px]">
        <Nav />

        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
