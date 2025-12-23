import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { BiSolidVideos } from "react-icons/bi";
import { FaPlusSquare } from "react-icons/fa";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Nav() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="w-[85%] lg:w-[40%] h-[55px] lg:h-[70px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[999999]">
      <div onClick={() => (window.location.href = "/")}>
        <AiFillHome className="text-white  w-[20px] h-[20px] lg:w-[25px] lg:h-[25px] cursor-pointer" />
      </div>
      <div>
        <FaSearch
          onClick={() => navigate("/search")}
          className="text-white  w-[20px] h-[20px] lg:w-[25px] lg:h-[25px] cursor-pointer"
        />
      </div>
      <div>
        <FaPlusSquare
          className="text-white  w-[20px] h-[20px] lg:w-[25px] lg:h-[25px] cursor-pointer"
          onClick={() => navigate("/upload")}
        />
      </div>
      <div>
        <BiSolidVideos
          className="text-white  w-[20px] h-[20px] lg:w-[25px] lg:h-[25px] cursor-pointer"
          onClick={() => navigate("/loop")}
        />
      </div>
      <div>
        <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] cursor-pointer rounded-full border border-black cursor-pointer overflow-hidden ">
          <img
            src={userData.profileImage || dp}
            className="w-full h-full object-cover"
            onClick={() => navigate(`/profile/${userData.username}`)}
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;
